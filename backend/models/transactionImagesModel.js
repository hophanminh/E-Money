const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
    addImage: entity => db.add('transactionimages', entity),

    updateImage: (id, updatedFields) => db.patch('transactionimages', updatedFields, { ID: id }),

    deleteImage: (id) => db.delete(`transactionimages`, { ID: id }),

    getImageByTransactionID: (TransactionID) =>
        db.loadSafe(`SELECT img.*
                FROM transactionimages as img
                WHERE img.TransactionID = ?`, [TransactionID]),

}