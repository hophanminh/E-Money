const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
    addEventType: entity => db.add('eventtypes', entity),

    updateEvent: (id, updatedFields) => db.patch('eventtypes', updatedFields, { ID: id }),

    deleteEvent: (id) => db.delete(`eventtypes`, { ID: id }),

    getAllEventType: () => {
        return db.loadSafe(`SELECT et.*
                    FROM eventtypes as et`);
    },
}