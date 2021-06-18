const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
  addImage: entity => db.add('transactionimages', entity),

  // addBatch: entityArray => db.loadSafe(`INSERT INTO transactionimages (ID, URL, TransactionID, DateAdded, PublicID) VALUES ?`, entityArray),

  updateImage: (id, updatedFields) => db.patch('transactionimages', updatedFields, { ID: id }),

  deleteImage: (id) => db.delete(`transactionimages`, { ID: id }),

  deleteImageByTxID: (id) => db.delete(`transactionimages`, { TransactionID: id }),

  getImageByTransactionID: (transactionID) => db.loadSafe(`SELECT * FROM transactionimages WHERE TransactionID = ?`, [transactionID]),

  getImageByID: id => db.loadSafe(`SELECT * FROM transactionimages WHERE ID = ?`, [id]),
}