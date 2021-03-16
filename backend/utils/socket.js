const userModel = require('../models/userModel');
const walletModel = require('../models/walletModel');
const transactionModel = require('../models/transactionModel');
const { v4: uuidv4 } = require('uuid');
const { convertToRegularDate, convertToRegularDateTime } = require('../utils/helper');
const config = require("../config/default.json");
const jwt = require('jsonwebtoken');
const socketHelper = require("./socketHelper");
const categoryModel = require('../models/categoryModel');

module.exports = function (io) {
    // authenticate
    io.use(function (socket, next) {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, config.PASSPORTKEY, function (err, decoded) {
                if (err) return next(new Error('Authentication error'));
                socket.decoded_userID = decoded;
                next();
            });
        }
        else {
            next(new Error('Authentication error'));
        }
    })

    io.on("connection", (socket) => {
        const decoded_userID = socket.decoded_userID.id;
        console.log('hello!', decoded_userID);

        // get private wallet data from server
        socket.on('get_private_wallet', async ({ }, callback) => {
            socket.join(decoded_userID);
            try {
                const { wallet, transactionList, categoryList } = await socketHelper.getPrivateWallet(decoded_userID);
                callback({ wallet, transactionList, categoryList });
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
                    EventID: newTransaction.eventID === 0 ? null : newTransaction.eventID,
                    CategoryID: newTransaction.catID,
                    WalletID: walletID,
                    UserID: decoded_userID,
                }
                await transactionModel.addTransaction(temp);
                callback({ ID });

                // annouce to other players
                const { wallet, transactionList, categoryList } = await socketHelper.getPrivateWallet(decoded_userID);
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
                console.log(newTransaction.price);
                await transactionModel.updateTransaction(transactionID, temp);
                callback();

                // annouce to other players
                const { wallet, transactionList, categoryList } = await socketHelper.getPrivateWallet(decoded_userID);
                socket.broadcast.to(decoded_userID).emit('wait_for_update', { wallet, transactionList, categoryList });
            } catch (error) {
                console.log(error);
            }
        });

        // delete Transaction
        socket.on('delete_transaction', async ({ id }, callback) => {
            try {
                await transactionModel.deleteTransaction(id);
                callback();

                // annouce to other players
                const { wallet, transactionList, categoryList } = await socketHelper.getPrivateWallet(decoded_userID);
                socket.broadcast.to(decoded_userID).emit('wait_for_update', { wallet, transactionList, categoryList });
            } catch (error) {
                console.log(error);
            }

        });

        // get category of wallet
        socket.on('get_category', async ({ walletID }, callback) => {
            socket.join(walletID);
            try {
                const defaultList = await categoryModel.getDefaultCategory();
                const customList = await categoryModel.getCustomCategoryFromWalletID(walletID);
                console.log(defaultList, customList);
                callback({ defaultList, customList });
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
