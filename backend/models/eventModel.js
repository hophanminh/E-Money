const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
    addEvent: entity => db.add('Events', entity),

    updateEvent: (id, updatedFields) => db.patch('Events', updatedFields, { ID: id }),

    deleteEvent: (id) => db.delete(`Events`, { ID: id }),

    updateEventCategory: (walletID, categoryID, final) =>
        db.loadSafe(`UPDATE events
              SET CategoryID = ?
              WHERE WalletID = ? AND CategoryID = ?`, [final, walletID, categoryID]),

    updateEventCategoryDefault: (categoryID, final) =>
            db.loadSafe(`UPDATE events
                SET CategoryID = ?
                WHERE CategoryID = ?`, [final, categoryID]),

    getEventByWalletID: (walletID) => {
        return db.loadSafe(`SELECT e.*, et.Name as TypeName, cat.Name as CategoryName, cat.IconID, SUM(t.Money) as TotalAmount
                    FROM Events as e LEFT JOIN eventtypes as et ON e.EventTypeID = et.ID
                                     LEFT JOIN Categories as cat ON e.CategoryID = cat.ID
                                     LEFT JOIN Transactions as t ON e.ID = t.EventID
                    WHERE e.WalletID = ?
                    GROUP BY e.ID
                    ORDER BY e.StartDate DESC`, [walletID]);
    },

    getEventByID: (eventID) =>
        db.loadSafe(`SELECT e.*
                FROM Events as e
                WHERE e.ID = ?`, [eventID]),

    getAllEvents: () => db.load(`SELECT * FROM Events`)

}