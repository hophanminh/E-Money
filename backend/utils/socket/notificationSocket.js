const notificationModel = require('../../models/notificationModel');

module.exports = function (socket, io, decoded_userID) {
    socket.on('get_notification', async ({ userID, limit }, callback) => {
        try {
            const count = await notificationModel.countUnreadNotification();
            const notificationList = await notificationModel.getNotificationByUserID(userID, limit);
            callback({ notificationList, count: count[0].count });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('load_more_notifications', async ({ userID, limit }, callback) => {
        try {
            const notificationList = await notificationModel.getNotificationByUserID(userID, limit);
            callback({ notificationList });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('mark_all_as_read', async ({ userID, notificationIDs, limit }, callback) => {
        const listIDs = notificationIDs.map(id => "'" + id.replace("'", "''") + "'").join();
        try {
            await notificationModel.updateListNotification(listIDs);
            const count = await notificationModel.countUnreadNotification();
            const notificationList = await notificationModel.getNotificationByUserID(userID, limit);
            callback({ notificationList, count: count[0].count });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('update_notification', async ({ userID, limit, notificationID, value }, callback) => {
        try {
            await notificationModel.updateNotification(notificationID, { IsRead: value });
            const notificationList = await notificationModel.getNotificationByUserID(userID, limit);
            callback({ notificationList });
        } catch (error) {
            console.log(error);
        }
    });
};
