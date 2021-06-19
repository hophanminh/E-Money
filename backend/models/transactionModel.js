const db = require('../utils/database');

module.exports = {
  addTransaction: entity => db.add('Transactions', entity),

  updateTransaction: (id, updatedFields) => db.patch('Transactions', updatedFields, { ID: id }),


  deleteTransaction: (id) => db.delete(`Transactions`, { ID: id }),

  updateTransactionCategory: (walletID, categoryID, final) =>
    db.loadSafe(`UPDATE Transactions
              SET CategoryID = ?
              WHERE WalletID = ? AND CategoryID = ?`, [final, walletID, categoryID]),

  updateTransactionCategoryDefault: (categoryID, final) =>
    db.loadSafe(`UPDATE Transactions
              SET CategoryID = ?
              WHERE CategoryID = ?`, [final, categoryID]),

  getTransactionByWalletID: (walletID) =>
    db.loadSafe(`SELECT t.ID AS id, t.Description AS description, t.Money AS price, t.DateAdded AS time, t.DateAdded AS timeModified,
                        t.UserID AS userID, cat.ID AS catID, cat.IconID AS IconID, cat.Name AS categoryName, 
                        e.ID AS eventID, e.Name AS eventName, u.Name AS userName, COUNT(h.ID) AS editNumber
                FROM Transactions t LEFT JOIN Categories cat ON t.CategoryID = cat.ID
                                      LEFT JOIN Events e ON t.EventID = e.ID
                                      LEFT JOIN Users u ON t.UserID = u.ID
                                      LEFT JOIN TransactionHistories h on t.ID = h.TransactionID
                WHERE t.WalletID = ? 
                GROUP BY t.ID
                ORDER BY t.DateAdded DESC`, [walletID]),

  getTransactionByID: (transactionID) =>
    db.loadSafe(`SELECT t.*
                FROM Transactions t
                WHERE t.ID = ?`, [transactionID]),

  getTransactionByWalletIDAndCategoryID: (walletID, CategoryID) =>
    db.loadSafe(`SELECT t.*
                FROM Transactions t
                WHERE t.WalletID = ? AND t.CategoryID = ?`, [walletID, CategoryID]),

}