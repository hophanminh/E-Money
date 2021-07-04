const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const walletModel = require('../models/walletModel');
const historyModel = require('../models/historyModel');
const eventModel = require('../models/eventModel');
const notificationModel = require('../models/notificationModel');
const userModel = require('../models/userModel');
const transactionModel = require('../models/transactionModel');
const teamModel = require('../models/teamModel');
const { FORMAT_DATETIME_PATTER, NOTIFICATION_AMOUNT_TO_LOAD } = require('../config/default.json');
const { getNextEventDate } = require('../utils/helper');
const { cloneDeep } = require('lodash');
const { nanoid } = require('nanoid')

module.exports = io => {
  cron.schedule('* * * * *', async () => {
    console.log('running a task every minute');
    const events = await eventModel.getAllRunningEvents();
    console.log(events.length === 0 ? 'No event' : 'Checking ' + events.length + ' running event(s)');

    try {
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        console.log('Event#' + (i + 1) + ': ' + event.Name);
        let now = moment(Date.now());
        let nextDate = moment(event.NextDate);
        let endDate = event.EndDate === null ? null : moment(event.EndDate);

        if (endDate === null) {
          if (nextDate > now) {
            console.log('    + Gladly, there\'s nothing to do, NextDate: ' + nextDate.format(FORMAT_DATETIME_PATTER.DATE_TIME));
            continue;
          }
        } else {
          if (endDate < nextDate) {
            await eventModel.updateEvent(event.ID, { Status: 0 });
            console.log('    + This event is overdue, auto changing its status, EndDate: ' + endDate.format(FORMAT_DATETIME_PATTER.DATE));
            continue;
          } else if (nextDate > now) {
            console.log('    + This event is not due yet');
            continue;
          }
        }

        const txID = uuidv4();
        const notiID = txID + ":" + event.WalletID;
        let transactionToAdd = {
          ID: txID,
          Money: event.ExpectingAmount,
          Description: 'Được thêm tự động từ sự kiện "' + event.Name + '"',
          DateAdded: nextDate.format(FORMAT_DATETIME_PATTER.DATE_TIME),
          DateModified: nextDate.format(FORMAT_DATETIME_PATTER.DATE_TIME),
          EventID: event.ID,
          CategoryID: event.CategoryID,
          WalletID: event.WalletID,
          UserID: null
        }

        const user = await userModel.getUserByWalletID(event.WalletID);
        const tempDate = nextDate;
        nextDate = getNextEventDate(event.NextDate, event.EventTypeID, event.Value, event.NextDate);

        if (user.length === 0) {
          // Team's wallet
          const team = await teamModel.getTeamByWalletId(event.WalletID);
          const users = await teamModel.getMembersByTeamId(team[0].ID);

          try {
            await transactionModel.addTransaction(transactionToAdd);
            await walletModel.updateTotalWallet(transactionToAdd.Money, event.WalletID);
            const history = cloneDeep(transactionToAdd);
            history.TransactionID = transactionToAdd.ID;
            history.ID = uuidv4();
            await historyModel.addHistoryTransaction(history);

          } catch (e) {
            console.log('Error while adding a new transaction for team\'s wallet', e);
          }

          try {
            await eventModel.updateEvent(event.ID, { NextDate: nextDate.format(FORMAT_DATETIME_PATTER.DATE_TIME) });
          } catch (e) {
            console.log('Error while updating event for team', e);
          }

          for (let i = 0; i < users.length; i++) {
            let notificationToAdd = {
              ID: "1:" + notiID  + ":" + nanoid(),
              Content: '',
              DateNotified: tempDate.format(FORMAT_DATETIME_PATTER.DATE_TIME),
              IsRead: false,
              UserID: users[i].ID
            }

            notificationToAdd.Content = 'Ví nhóm ' + team[0].Name +
              ' đã tự động thêm 1 giao dịch từ sự kiện "' + event.Name +
              '" với số tiền ' + event.ExpectingAmount;

            try {
              await notificationModel.addNotification(notificationToAdd);
            } catch (e) {
              console.log('Error while adding a new notification for a user in team', e);
            }

            const notificationList = await notificationModel.getNotificationByUserID(users[i].ID, NOTIFICATION_AMOUNT_TO_LOAD);
            const count = await notificationModel.countUnreadNotification(users[i].ID);
            io.emit(`new_notification_added_${users[i].ID}`, { notificationList, count: count[0].count });
          }

          const eventList = await eventModel.getEventByWalletID(event.WalletID);
          io.sockets.emit(`wait_for_update_event_${event.WalletID}`, { eventList });

          // emit tx
          const transactionList = await transactionModel.getTransactionByWalletID(event.WalletID);
          const { total, spend, receive } = calculateStat(transactionList);
          io.sockets.emit(`wait_for_update_transaction_${event.WalletID}`, { transactionList, total, spend, receive });

        } else {
          // User's wallet
          const userID = user[0].ID;
          transactionToAdd.UserID = userID;
          nextDate = getNextEventDate(event.NextDate, event.EventTypeID, event.Value, event.NextDate);

          let notificationToAdd = {
            ID: "0:" + notiID + ":" + nanoid(),
            Content: '',
            DateNotified: tempDate.format(FORMAT_DATETIME_PATTER.DATE_TIME),
            IsRead: false,
            UserID: userID
          }

          notificationToAdd.Content = 'Ví của bạn đã tự động thêm 1 giao dịch từ sự kiện "' +
            event.Name + '" với số tiền ' + event.ExpectingAmount;

          try {
            await transactionModel.addTransaction(transactionToAdd);
            await walletModel.updateTotalWallet(transactionToAdd.Money, event.WalletID);
            const history = cloneDeep(transactionToAdd);
            history.TransactionID = transactionToAdd.ID;
            history.ID = uuidv4();
            await historyModel.addHistoryTransaction(history);

          } catch (e) {
            console.log('Error while adding a new transaction', e);
          }

          try {
            await eventModel.updateEvent(event.ID, { NextDate: nextDate.format(FORMAT_DATETIME_PATTER.DATE_TIME) });
          } catch (e) {
            console.log('Error while updating event', e);
          }

          try {
            await notificationModel.addNotification(notificationToAdd);
          } catch (e) {
            console.log('Error while adding a new notification', e);
          }

          // emit noti
          const notificationList = await notificationModel.getNotificationByUserID(userID, NOTIFICATION_AMOUNT_TO_LOAD);
          const count = await notificationModel.countUnreadNotification(userID);
          io.emit(`new_notification_added_${userID}`, { notificationList, count: count[0].count });

          // emit event
          const eventList = await eventModel.getEventByWalletID(event.WalletID);
          io.sockets.emit(`wait_for_update_event_${event.WalletID}`, { eventList });

          // emit tx
          const transactionList = await transactionModel.getTransactionByWalletID(event.WalletID);
          const { total, spend, receive } = calculateStat(transactionList);
          io.sockets.emit(`wait_for_update_transaction_${event.WalletID}`, { transactionList, total, spend, receive });
        }

        console.log('    + Auto-doing an event, NextDate: ' + nextDate.format(FORMAT_DATETIME_PATTER.DATE_TIME));
      }
    } catch (error) {
      console.log(error);
    }
  });

  const calculateStat = (transactionList) => {
    if (!transactionList) {
      return null;
    }
    let total = 0;
    let spend = 0;
    let receive = 0;
    for (let i = 0; i < transactionList.length; i++) {
      total += transactionList[i].price;
      const month = moment(transactionList[i].time, 'YYYY-MM-DD HH:mm:ss').format('M');
      const currentMonth = moment().format('M');
      if (month === currentMonth) {
        if (transactionList[i].price < 0) {
          spend += transactionList[i].price
        }
        else {
          receive += transactionList[i].price
        }
      }
    }

    return { total, spend, receive }
  }
}
