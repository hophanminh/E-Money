const db = require('../utils/database');

module.exports = {
  addHistoryTransaction: entity => db.add('TransactionHistories', entity),

  deleteHistoryTransaction: (id) => db.delete(`TransactionHistories`, { TransactionID: id }),

  updateHistoryCategory: (walletID, categoryID, final) =>
    db.loadSafe(`UPDATE TransactionHistories
          SET CategoryID = ?
          WHERE WalletID = ? AND CategoryID = ?`, [final, walletID, categoryID]),

  updateHistoryCategoryDefault: (categoryID, final) =>
    db.loadSafe(`UPDATE TransactionHistories
            SET CategoryID = ?
            WHERE CategoryID = ?`, [final, categoryID]),

  getHistoryByWalletIDAndTransactionID: (walletID, TransactionID) =>
    db.loadSafe(`SELECT h.*, cat.Name as CategoryName, cat.IconID, e.Name as EventName
                FROM TransactionHistories h LEFT JOIN Categories cat ON h.CategoryID = cat.ID
                                                LEFT JOIN Events e ON h.EventID = e.ID
                WHERE h.WalletID = ? AND h.TransactionID = ?
                ORDER BY h.DateModified DESC`, [walletID, TransactionID]),

}