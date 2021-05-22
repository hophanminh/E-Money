const db = require('../utils/database');

module.exports = {

  countUnreadNotification: userID => db.load(`
    SELECT COUNT(*) AS count
    FROM Notifications
    WHERE IsRead = FALSE AND UserID = ${userID}
  `),

  getNotificationByUserID: (userID, limit) => db.load(`
    SELECT *
    FROM Notifications
    WHERE UserID = ${userID}
    ORDER BY IsRead, DateNotified DESC
    LIMIT ${limit}
  `),

  addNotification: entity => db.add('Notifications', entity),

  updateNotification: (ID, entity) => db.patch('Notifications', entity, { ID }),

  updateListNotification: IDs => db.load(`UPDATE Notifications SET IsRead = TRUE WHERE ID IN (${IDs})`)

}