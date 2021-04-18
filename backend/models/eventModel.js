const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
    addEvent: entity => db.add('Events', entity),

    updateEvent: (id, updatedFields) => db.patch('Events', updatedFields, { ID: id }),

    deleteEvent: (id) => db.delete(`Events`, { ID: id }),

    getEventByWalletID: (walletID) => {
        return db.loadSafe(`SELECT e.*, et.Name as TypeName, cat.Name as CategoryName, cat.IconID
                    FROM Events as e LEFT JOIN eventtypes as et ON e.EventTypeID = et.ID
                                     LEFT JOIN Categories as cat ON e.CategoryID = cat.ID
                    WHERE e.WalletID = ?
                    ORDER BY e.StartDate DESC`, [walletID]);
    },

    getEventByID: (eventID) =>
        db.loadSafe(`SELECT e.*
                FROM Events as e
                WHERE e.ID = ?`, [eventID]),

}