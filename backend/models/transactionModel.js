const db = require('../utils/database');

module.exports = {
  addTransaction: entity => db.add('Transactions', entity),

  updateTransaction: (id, updatedFields) => db.patch('Transactions', updatedFields, { ID: id }),

  deleteTransaction: (id) => db.delete(`Transactions`, { ID: id }),


  getTransactionFromWalletID: (walletID) =>
    db.loadSafe(`SELECT t.ID as id, cat.ID as catID, cat.IconID as IconID, cat.Name as categoryName, 
    t.Description as description, t.Money as price, t.DateAdded as time, events.ID as eventID, events.Name as eventName
                FROM Transactions as t LEFT JOIN Categories as cat ON t.CategoryID = cat.ID
                                      LEFT JOIN events ON t.EventID = events.ID
                WHERE t.WalletID = ? 
                ORDER BY t.DateAdded DESC`, [walletID]),

  getTransactionByID: (transactionID) =>
    db.loadSafe(`SELECT t.*
                FROM Transactions as t
                WHERE t.ID = ?`, [transactionID]),

}