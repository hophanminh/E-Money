const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const eventModel = require('../models/eventModel');
const notificationModel = require('../models/notificationModel');
const userModel = require('../models/userModel');
const transactionModel = require('../models/transactionModel');
const { EVENT_TYPE, FORMAT_DATETIME_PATTER, NOTIFICATION_AMOUNT_TO_LOAD } = require('../config/default.json');
const { DAILY, WEEKLY, MONTHLY, YEARLY } = EVENT_TYPE;
const { getNextEventDate } = require('../utils/helper');

module.exports = io => {
  cron.schedule('* * * * *', async () => {
    console.log('running a task every minute');
    const events = await eventModel.getAllRunningEvents();
    console.log('Checking ' + events.length + ' running event(s)');

    for (let i = 0; i < events.length; i++) {
      console.log('Event #' + (i + 1));
      const event = events[i];
      let now = moment(Date.now());
      let nextDate = moment(event.NextDate);
      let endDate = event.EndDate === null ? null : moment(event.EndDate);

      if (endDate === null && nextDate > now) {
        console.log('    + Gladly, there\'s nothing to do, NextDate: ' + nextDate.format(FORMAT_DATETIME_PATTER.DATE_TIME));
        continue;
      } else if (endDate !== null && endDate < nextDate) {
        await eventModel.updateEvent(event.ID, { Status: 0 });
        console.log('    + This event is overdue, auto changing its status, EndDate: ' + endDate.format(FORMAT_DATETIME_PATTER.DATE));
        continue;
      }

      const user = await userModel.getUserByWalletID(event.WalletID);
      const userID = user[0].ID;
      nextDate = getNextEventDate(event.NextDate, event.EventTypeID, event.Value);

      let transactionToAdd = {
        ID: uuidv4(),
        Money: event.ExpectingAmount,
        Description: 'Được thêm tự động từ sự kiện đã lên lịch cho ngày ' + nextDate.format(FORMAT_DATETIME_PATTER.DATE_FOR_FRONT_END),
        DateAdded: now.format(FORMAT_DATETIME_PATTER.DATE_TIME),
        DateModified: now.format(FORMAT_DATETIME_PATTER.DATE_TIME),
        EventID: event.ID,
        CategoryID: event.CategoryID,
        WalletID: event.WalletID,
        UserID: userID
      }

      let notificationToAdd = {
        ID: uuidv4(),
        Content: '',
        DateNotified: now.format(FORMAT_DATETIME_PATTER.DATE_TIME),
        IsRead: false,
        UserID: userID
      }

      notificationToAdd.Content = 'Ví của bạn đã tự động thêm 1 giao dịch loại ';

      switch (+event.EventTypeID) {
        case DAILY:
          notificationToAdd.Content += 'hằng ngày';
          break;
        case WEEKLY:
          notificationToAdd.Content += 'hằng tuần';
          break;
        case MONTHLY:
          notificationToAdd.Content += 'hằng tháng';
          break;
        case YEARLY:
          notificationToAdd.Content += 'hằng năm';
          break;
        default:
          console.log('Do nothing');
      }

      notificationToAdd.Content += ', với số tiền: ' + event.ExpectingAmount + ', cho ngày: ' + nextDate.format(FORMAT_DATETIME_PATTER.DATE_FOR_FRONT_END);

      try {
        await transactionModel.addTransaction(transactionToAdd);
      } catch (e) {
        console.log('Error while adding a new transaction', e);
      }

      try {
        await notificationModel.addNotification(notificationToAdd);
      } catch (e) {
        console.log('Error while adding a new notification', e);
      }

      try {
        await eventModel.updateEvent(event.ID, { NextDate: nextDate.format(FORMAT_DATETIME_PATTER.DATE_TIME) });
      } catch (e) {
        console.log('Error while updating event', e);
      }

      const notificationList = await notificationModel.getNotificationByUserID(userID, NOTIFICATION_AMOUNT_TO_LOAD);
      const count = await notificationModel.countUnreadNotification(userID);
      io.emit(`new_notification_added_${userID}`, { notificationList, count: count[0].count });
      const eventList = await eventModel.getEventByWalletID(event.WalletID);
      io.in(event.WalletID).emit('wait_for_update_event', { eventList });
      
      console.log('    + Auto-doing an event, NextDate: ' + nextDate.format(FORMAT_DATETIME_PATTER.DATE_TIME));
    }
  });
}
