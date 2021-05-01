const db = require('../utils/database');

module.exports = {

  getNotificationByUserID: userID => db.load(`
    SELECT *
    FROM Notification N
    WHERE UserID = ${userID} AND DateNotified >= NOW()
    ORDER BY DateNotified
  `),

  addNotification: entity => db.add('Notification', entity)

}