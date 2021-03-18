const walletModel = require('../../models/walletModel');
const transactionModel = require('../../models/transactionModel');
const config = require("../../config/default.json");
const categoryModel = require('../../models/categoryModel');

getPrivateWallet = async (decoded_userID) => {
    // annouce to other players
    const wallet = await walletModel.getPrivateWallet(decoded_userID);
    const transactionList = await transactionModel.getTransactionFromWalletID(wallet[0].ID);
    const categoryList = await categoryModel.getAllCategoryFromWalletID(wallet[0].ID);

    return { wallet, transactionList, categoryList };
}

module.exports = { getPrivateWallet };