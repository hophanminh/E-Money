const db = require('../utils/database');

module.exports = {
  addWallet: entity => db.add('Wallets', entity),


  updateTotalWallet: (amount, walletID) =>
    db.loadSafe(`UPDATE Wallets
                SET TotalCount = TotalCount + ?
                WHERE ID = ?`, [amount, walletID]),

  getWalletById: (id) => {
    const sql = `SELECT * from Wallets t WHERE t.ID = '` + id + `'`;
  },

  getPrivateWallet: (userID) =>
    db.loadSafe(`SELECT w.*
                FROM users as u LEFT JOIN Wallets as w ON u.WalletID = w.ID
                WHERE u.ID = ? `, [userID]),

  deleteWallet: (id) => {
    return db.delete('wallets', {ID: id})
  }
}