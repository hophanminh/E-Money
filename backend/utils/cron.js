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
    const events = await eventModel.getAllEvents();
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      let now = moment(Date.now());
      let nextDate = moment(event.NextDate);
      if (nextDate > now) {
        console.log('Gladly, there\'s nothing to do');
        break;
      }

      const user = await userModel.getUserByWalletID(event.WalletID);
      const userID = user[0].ID;
      nextDate = getNextEventDate(event.NextDate, event.EventTypeID, event.Value);

      let transactionToAdd = {
        ID: uuidv4(),
        Money: event.ExpectingAmount,
        Description: 'Được thêm tự động từ sự kiện đã lên lịch',
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

      switch (+event.EventTypeID) {
        case DAILY:
          notificationToAdd.Content = 'Ví của bạn đã tự động thêm 1 giao dịch hằng ngày';
          break;
        case WEEKLY:
          notificationToAdd.Content = 'Ví của bạn đã tự động thêm 1 giao dịch hằng tuần';
          break;
        case MONTHLY:
          notificationToAdd.Content = 'Ví của bạn đã tự động thêm 1 giao dịch hằng tháng';
          break;
        case YEARLY:
          notificationToAdd.Content = 'Ví của bạn đã tự động thêm 1 giao dịch hằng năm';
          break;
        default:
          console.log('Do nothing');
      }

      notificationToAdd.Content += ', với số tiền: ' + event.ExpectingAmount;

      await transactionModel.addTransaction(transactionToAdd);
      await notificationModel.addNotification(notificationToAdd);
      await eventModel.updateEvent(event.ID, { NextDate: nextDate });

      const notificationList = await notificationModel.getNotificationByUserID(userID, NOTIFICATION_AMOUNT_TO_LOAD);
      const count = await notificationModel.countUnreadNotification(userID);
      // io.on("connection", (socket) => {
      //   socket.emit(`new_notification_added_${userID}`, { notificationList, count: count[0].count });
      // });

      console.log('Auto-doing an event with ID: ' + event.ID);
    }
  });
}
