const db = require('../utils/database');

module.exports = {
    addHistoryTransaction: entity => db.add('transactionhistories', entity),

    deleteHistoryTransaction: (id) => db.delete(`transactionhistories`, { TransactionID: id }),

    updateHistoryCategory: (walletID, categoryID, final) =>
        db.loadSafe(`UPDATE transactionhistories
          SET CategoryID = ?
          WHERE WalletID = ? AND CategoryID = ?`, [final, walletID, categoryID]),

        updateHistoryCategoryDefault: (categoryID, final) =>
    db.loadSafe(`UPDATE transactionhistories
        SET CategoryID = ?
        WHERE CategoryID = ?`, [final, categoryID]),

    getHistoryByWalletIDAndTransactionID: (walletID, TransactionID) =>
        db.loadSafe(`SELECT h.*, cat.Name as CategoryName, cat.IconID, events.Name as EventName
                FROM transactionhistories as h LEFT JOIN Categories as cat ON h.CategoryID = cat.ID
                                                LEFT JOIN events ON h.EventID = events.ID
                WHERE h.WalletID = ? AND h.TransactionID = ?
                ORDER BY h.DateModified DESC`, [walletID, TransactionID]),

}