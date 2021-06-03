const db = require('../utils/database');

module.exports = {

  countUnreadNotification: userID => db.loadSafe(`
    SELECT COUNT(*) AS count
    FROM Notifications
    WHERE IsRead = FALSE AND UserID = ?
  `, [userID]),

  getNotificationByUserID: (userID, limit) => db.loadSafe(`
    SELECT *
    FROM Notifications
    WHERE UserID = ?
    ORDER BY IsRead, DateNotified DESC
    LIMIT ?
  `, [userID, limit]),

  addNotification: entity => db.add('Notifications', entity),

  updateNotification: (ID, entity) => db.patch('Notifications', entity, { ID }),

  updateListNotification: IDs => db.load(`UPDATE Notifications SET IsRead = TRUE WHERE ID IN (${IDs})`)

}