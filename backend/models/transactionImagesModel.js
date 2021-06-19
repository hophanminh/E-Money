const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
  addImage: entity => db.add('TransactionImages', entity),

  updateImage: (id, updatedFields) => db.patch('TransactionImages', updatedFields, { ID: id }),

  deleteImage: (id) => db.delete(`TransactionImages`, { ID: id }),

  deleteImageByTxID: (id) => db.delete(`TransactionImages`, { TransactionID: id }),

  getImageByTransactionID: (transactionID) => db.loadSafe(`SELECT * FROM TransactionImages WHERE TransactionID = ?`, [transactionID]),

  getImageByID: id => db.loadSafe(`SELECT * FROM TransactionImages WHERE ID = ?`, [id]),
}