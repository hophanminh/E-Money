const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
  addEvent: entity => db.add('Events', entity),

  updateEvent: (id, updatedFields) => db.patch('Events', updatedFields, { ID: id }),

  deleteEvent: (id) => db.delete(`Events`, { ID: id }),

  updateEventCategory: (walletID, categoryID, final) =>
    db.loadSafe(`UPDATE Events
              SET CategoryID = ?
              WHERE WalletID = ? AND CategoryID = ?`, [final, walletID, categoryID]),

  EndAllEventByWalletID: (walletID) =>
    db.loadSafe(`UPDATE Events
                    SET Status = 0
                    WHERE WalletID = ?`, [walletID]),

  updateEventCategoryDefault: (categoryID, final) =>
    db.loadSafe(`UPDATE Events
                SET CategoryID = ?
                WHERE CategoryID = ?`, [final, categoryID]),

  getEventByWalletID: (walletID) => {
    return db.loadSafe(`SELECT e.*, et.Name AS TypeName, cat.Name AS CategoryName, cat.IconID, SUM(t.Money) AS TotalAmount
                    FROM Events e LEFT JOIN EventTypes et ON e.EventTypeID = et.ID
                                     LEFT JOIN Categories cat ON e.CategoryID = cat.ID
                                     LEFT JOIN Transactions t ON e.ID = t.EventID
                    WHERE e.WalletID = ?
                    GROUP BY e.ID
                    ORDER BY e.StartDate DESC`, [walletID]);
  },

  getEventByID: (eventID) =>
    db.loadSafe(`SELECT e.*
                FROM Events e
                WHERE e.ID = ?`, [eventID]),

  getAllRunningEvents: () => db.load(`SELECT * FROM Events WHERE Status = 1`)

}