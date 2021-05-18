const config = require("../../config/default.json");
const jwt = require('jsonwebtoken');

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

        // socket by model
        require('./transactionSocket')(socket, io, decoded_userID);
        require('./categorySocket')(socket, io, decoded_userID);
        require('./eventSocket')(socket, io, decoded_userID);
        require('./transactionImagesSocket')(socket, decoded_userID);
        require('./teamSocket')(socket, io, decoded_userID);
        require('./notificationSocket')(socket, io, decoded_userID);

        // disconnect by leaving page
        socket.on("disconnect", async () => {
            if (!socket.user) {
                return;
            }
            console.log(socket.user.name + " disconnected");
        });
    })
}
