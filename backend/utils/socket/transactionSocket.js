const helperSocket = require("./helperSocket");
const { v4: uuidv4 } = require('uuid');
const { convertToRegularDate, convertToRegularDateTime } = require('../helper');
const transactionModel = require('../../models/transactionModel');
const walletModel = require('../../models/walletModel');

module.exports = function (socket, decoded_userID) {

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
            callback({ ID });

            // annouce to other players
            const { wallet, transactionList, categoryList } = await helperSocket.getPrivateWallet(decoded_userID);
            socket.broadcast.to(decoded_userID).emit('wait_for_update', { wallet, transactionList, categoryList });

        } catch (error) {
            console.log(error);
        }
    });

    // update Transaction
    socket.on('update_transaction', async ({ transactionID, newTransaction }, callback) => {
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
            callback();

            // annouce to other players
            const { wallet, transactionList, categoryList } = await helperSocket.getPrivateWallet(decoded_userID);
            socket.broadcast.to(decoded_userID).emit('wait_for_update', { wallet, transactionList, categoryList });
        } catch (error) {
            console.log(error);
        }
    });

    // delete Transaction
    socket.on('delete_transaction', async ({ id }, callback) => {
        try {
            const deleted = await transactionModel.getTransactionByID(id);
            if (deleted.length === 1) {
                await walletModel.updateTotalWallet(0 - deleted[0].Money, deleted[0].WalletID);
                await transactionModel.deleteTransaction(id);
            }

            callback();

            // annouce to other players
            const { wallet, transactionList, categoryList } = await helperSocket.getPrivateWallet(decoded_userID);
            socket.broadcast.to(decoded_userID).emit('wait_for_update', { wallet, transactionList, categoryList });
        } catch (error) {
            console.log(error);
        }

    });
};
