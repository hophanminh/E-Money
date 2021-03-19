const helperSocket = require("./helperSocket");

module.exports = function (socket, decoded_userID) {

    // get private wallet data from server
    socket.on('get_private_wallet', async ({ }, callback) => {
        socket.join(decoded_userID);
        try {
            const { wallet, transactionList, categoryList } = await helperSocket.getPrivateWallet(decoded_userID);
            callback({ wallet, transactionList, categoryList });
        } catch (error) {
            console.log(error);
        }

    });
};
