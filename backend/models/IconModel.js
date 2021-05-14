const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
    addIcon: entity => db.add('Icons', entity),

    updateIcon: (id, updatedFields) => db.patch('Icons', updatedFields, { ID: id }),

    deleteIcon: (id) => db.delete(`Icons`, { ID: id }),

    getAllIcon: () =>
        db.loadSafe(`SELECT i.*
                    FROM icons as i`),


}