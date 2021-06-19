const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
  addEventType: entity => db.add('EventTypes', entity),

  updateEvent: (id, updatedFields) => db.patch('EventTypes', updatedFields, { ID: id }),

  deleteEvent: (id) => db.delete(`EventTypes`, { ID: id }),

  getAllEventType: () => {
    return db.loadSafe(`SELECT et.*
                    FROM EventTypes et`);
  },
}