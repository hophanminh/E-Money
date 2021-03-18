const helperSocket = require("./helperSocket");
const categoryModel = require('../../models/categoryModel');

module.exports = function (socket, decoded_userID) {

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

};
