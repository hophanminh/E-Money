const userModel = require('../models/userModel');
const walletModel = require('../models/walletModel');
const transactionModel = require('../models/transactionModel');
const { v4: uuidv4 } = require('uuid');
const { convertToRegularDate, convertToRegularDateTime } = require('../utils/helper');

module.exports = function (io) {
    io.on("connection", (socket) => {
        // get Room data from server
        socket.on('get_private_wallet', async ({ userID }, callback) => {
            socket.join(userID);
            try {
                const wallet = await walletModel.getPrivateWallet(userID);
                const transactionList = await transactionModel.getTransactionFromWalletID(wallet[0].ID);

                const categoryList = null;
                callback({ wallet, transactionList, categoryList });
            } catch (error) {
                console.log(error);
            }

        });

        // update other instance
        socket.on('update_private_wallet', async ({ userID }) => {

            // save to database
            try {
                const wallet = await walletModel.getPrivateWallet(userID);
                const transaction = await transactionModel.getTransactionFromWalletID(wallet.ID);

                const transactionList = null;
                const categoryList = null;

                // annouce to other players
                socket.broadcast.to(userID).emit('wait_for_update', { wallet, transactionList, categoryList });
            } catch (error) {
                console.log(error);
            }
        });

        // add Transaction
        socket.on('add_transaction', async ({ walletID, userID, newTransaction }, callback) => {
            try {
                const ID = uuidv4();
                const temp = {
                    ID: ID,
                    Money: newTransaction.price,
                    Description: newTransaction.description,
                    DateAdded: convertToRegularDateTime(newTransaction.time),
                    DateModified: convertToRegularDateTime(newTransaction.time),
                    EventID: newTransaction.eventID === 0 ? null : newTransaction.eventID,
                    ExchangeTypeID: newTransaction.catID,
                    WalletID: walletID,
                    UserID: userID,
                }
                await transactionModel.addTransaction(temp);
                callback({ ID });

                // annouce to other players
                socket.emit('update_private_wallet', { userID });
            } catch (error) {
                console.log(error);
            }
        });

        // update Transaction
        socket.on('update_transaction', async ({ userID, transactionID, newTransaction }, callback) => {
            try {
                const temp = {
                    Money: newTransaction.price,
                    Description: newTransaction.description,
                    DateAdded: convertToRegularDateTime(newTransaction.time),
                    DateModified: convertToRegularDateTime(new Date()),
                    EventID: newTransaction.eventID === 0 ? null : newTransaction.eventID,
                    ExchangeTypeID: newTransaction.catID,
                }
                console.log(newTransaction.price);
                await transactionModel.updateTransaction(transactionID, temp);
                callback();

                // annouce to other players
                socket.emit('update_private_wallet', { userID });
            } catch (error) {
                console.log(error);
            }
        });

        // delete Transaction
        socket.on('delete_transaction', async ({ userID, id }, callback) => {
            try {
                await transactionModel.deleteTransaction(id);
                callback();

                // annouce to other players
                socket.emit('update_private_wallet', { userID });
            } catch (error) {
                console.log(error);
            }

        });

        // disconnect by leaving page
        socket.on("disconnect", async () => {
            if (!socket.user) {
                return;
            }
            console.log(socket.user.name + " disconnected");
        });
    })
}
