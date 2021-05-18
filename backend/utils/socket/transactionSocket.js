const { v4: uuidv4 } = require('uuid');
const { convertToRegularDate, convertToRegularDateTime } = require('../helper');
const transactionModel = require('../../models/transactionModel');
const walletModel = require('../../models/walletModel');
const moment = require('moment');
const eventModel = require('../../models/eventModel');

module.exports = function (socket, io, decoded_userID) {

  // get Transaction of wallet
  socket.on('get_transaction', async ({ walletID }, callback) => {
    console.log('lấy', walletID);
    socket.join(walletID);
    try {
      const transactionList = await transactionModel.getTransactionByWalletID(walletID);
      const { total, spend, receive } = calculateStat(transactionList); console.log(transactionList);
      callback({ transactionList, total, spend, receive });
    } catch (error) {
      console.log(error);
    }

  });

  // add Transaction
  socket.on('add_transaction', async ({ walletID, newTransaction }, callback) => {
    try {
      const ID = uuidv4();
      const temp = {
        ID: ID,
        Money: newTransaction.price,
        Description: newTransaction.description,
        DateAdded: convertToRegularDateTime(newTransaction.time),
        DateModified: convertToRegularDateTime(newTransaction.time),
        EventID: newTransaction.eventID,
        CategoryID: newTransaction.catID,
        WalletID: walletID,
        UserID: decoded_userID,
      }
      await transactionModel.addTransaction(temp);
      await walletModel.updateTotalWallet(newTransaction.price, walletID);

      // annouce to other players
      const transactionList = await transactionModel.getTransactionByWalletID(walletID);
      const { total, spend, receive } = calculateStat(transactionList);
      io.in(walletID).emit('wait_for_update_transaction', { transactionList, total, spend, receive });

      callback({ ID })
    } catch (error) {
      console.log(error);
    }
  });

  // update Transaction
  socket.on('update_transaction', async ({ walletID, transactionID, newTransaction }) => {
    try {
      const temp = {
        Money: newTransaction.price,
        Description: newTransaction.description,
        DateAdded: convertToRegularDateTime(newTransaction.time),
        DateModified: convertToRegularDateTime(new Date()),
        EventID: newTransaction.eventID === 0 ? null : newTransaction.eventID,
        CategoryID: newTransaction.catID,
      }
      const updated = await transactionModel.getTransactionByID(transactionID);
      if (updated.length === 1) {
        await transactionModel.updateTransaction(transactionID, temp);
        await walletModel.updateTotalWallet(newTransaction.price - updated[0].Money, updated[0].WalletID);
      }

      // annouce to other players
      const transactionList = await transactionModel.getTransactionByWalletID(walletID);
      const { total, spend, receive } = calculateStat(transactionList);
      io.in(walletID).emit('wait_for_update_transaction', { transactionList, total, spend, receive });
    } catch (error) {
      console.log(error);
    }
  });

  // delete Transaction
  socket.on('delete_transaction', async ({ walletID, id }) => {
    try {
      const deleted = await transactionModel.getTransactionByID(id);
      if (deleted.length === 1) {
        await walletModel.updateTotalWallet(0 - deleted[0].Money, deleted[0].WalletID);
        await transactionModel.deleteTransaction(id);
      }

      // annouce to other players
      const transactionList = await transactionModel.getTransactionByWalletID(walletID);
      const { total, spend, receive } = calculateStat(transactionList);
      io.in(walletID).emit('wait_for_update_transaction', { transactionList, total, spend, receive });
    } catch (error) {
      console.log(error);
    }

  });
};

const calculateStat = (transactionList) => {
  if (!transactionList) {
    return null
  }
  let spend = 0;
  let receive = 0;
  for (let i = 0; i < transactionList.length; i++) {
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

  let total = spend + receive;
  return { total, spend, receive }
}