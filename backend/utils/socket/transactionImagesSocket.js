const helperSocket = require("./helperSocket");
const transactionImagesModel = require('../../models/transactionImagesModel');
const { v4: uuidv4 } = require('uuid');

module.exports = function (socket, decoded_userID) {

    // get image from 1 transaction
    socket.on('get_transaction_image', async ({ TransactionID }, callback) => {
        try {
            const imageList = await transactionImagesModel.getImageByTransactionID(TransactionID);
            callback({ imageList });
        } catch (error) {
            console.log(error);
        }

    });
};
