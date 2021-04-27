const db = require('../utils/database');

module.exports = {
  addTransaction: entity => db.add('Transactions', entity),

  updateTransaction: (id, updatedFields) => db.patch('Transactions', updatedFields, { ID: id }),


  deleteTransaction: (id) => db.delete(`Transactions`, { ID: id }),

  updateTransactionCategory: (walletID, categoryID, final) =>
    db.loadSafe(`UPDATE Transactions
              SET CategoryID = ?
              WHERE WalletID = ? AND CategoryID = ?`, [final, walletID, categoryID]),

  getTransactionByWalletID: (walletID) =>
    db.loadSafe(`SELECT t.ID as id, t.Description as description, t.Money as price, t.DateAdded as time, 
                        cat.ID as catID, cat.IconID as IconID, cat.Name as categoryName, 
                        events.ID as eventID, events.Name as eventName,
                        Users.Name as userName
                FROM Transactions as t LEFT JOIN Categories as cat ON t.CategoryID = cat.ID
                                      LEFT JOIN events ON t.EventID = events.ID
                                      LEFT JOIN Users ON t.UserID = Users.ID
                WHERE t.WalletID = ? 
                ORDER BY t.DateAdded DESC`, [walletID]),

  getTransactionByID: (transactionID) =>
    db.loadSafe(`SELECT t.*
                FROM Transactions as t
                WHERE t.ID = ?`, [transactionID]),

  getTransactionByWalletIDAndCategoryID: (walletID, CategoryID) =>
    db.loadSafe(`SELECT t.*
                FROM Transactions as t
                WHERE t.WalletID = ? AND t.CategoryID = ?`, [walletID, CategoryID]),

}