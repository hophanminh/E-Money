const db = require('../utils/database');

module.exports = {
  addWallet: entity => db.add('Wallets', entity),


  updateTotalWallet: (amount, walletID) =>
    db.loadSafe(`UPDATE Wallets
                SET TotalCount = TotalCount + ?
                WHERE ID = ?`, [amount, walletID]),

  getPrivateWallet: (userID) =>
    db.loadSafe(`SELECT w.*
                FROM Users u LEFT JOIN Wallets w ON u.WalletID = w.ID
                WHERE u.ID = ? `, [userID]),

  deleteWallet: (id) => db.delete('Wallets', { ID: id })

}