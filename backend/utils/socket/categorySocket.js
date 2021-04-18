const helperSocket = require("./helperSocket");
const categoryModel = require('../../models/categoryModel');
const { v4: uuidv4 } = require('uuid');

module.exports = function (socket, decoded_userID) {

    // get category of wallet
    socket.on('get_category', async ({ walletID }, callback) => {
        socket.join(walletID);
        try {
            const defaultList = await categoryModel.getDefaultCategory();
            const customList = await categoryModel.getCustomCategoryFromWalletID(walletID);
            callback({ defaultList, customList });
        } catch (error) {
            console.log(error);
        }

    });

    // add category
    socket.on('add_category', async ({ walletID, newCategory }, callback) => {
        try {
            const ID = uuidv4();
            const temp = {
                ID: ID,
                Name: newCategory.Name,
                IsDefault: false,
                WalletID: walletID,
                IconID: newCategory.IconID,
            }
            await categoryModel.addCategory(temp);
            callback({ ID });

            // annouce to other players
            const { wallet, transactionList, categoryList } = await helperSocket.getPrivateWallet(decoded_userID);
            socket.broadcast.to(walletID).emit('wait_for_update', { wallet, transactionList, categoryList });

        } catch (error) {
            console.log(error);
        }
    });

    // update category
    socket.on('update_category', async ({ categoryID, newCategory }, callback) => {
        try {
            const temp = {
                Name: newCategory.Name,
                IsDefault: false,
                IconID: newCategory.IconID,
            }
            const updated = await categoryModel.getCategoryByID(categoryID);
            if (updated.length === 1) {
                await categoryModel.updateCategory(categoryID, temp);
                callback();
            }

            // annouce to other players
            const { wallet, transactionList, categoryList } = await helperSocket.getPrivateWallet(decoded_userID);
            socket.broadcast.to(walletID).emit('wait_for_update', { wallet, transactionList, categoryList });

        } catch (error) {
            console.log(error);
        }
    });

    // delete category
    socket.on('delete_category', async ({ id }, callback) => {
        try {
            const deleted = await categoryModel.getCategoryByID(id);
            if (deleted.length === 1) {
                await categoryModel.deleteCategory(id);
                callback();
            }


            // annouce to other players
            const { wallet, transactionList, categoryList } = await helperSocket.getPrivateWallet(decoded_userID);
            socket.broadcast.to(walletID).emit('wait_for_update', { wallet, transactionList, categoryList });
        } catch (error) {
            console.log(error);
        }

    });

};
