const db = require('../utils/database');

module.exports = {
  addWallet: entity => db.add('Wallet', entity),

  getPrivateWallet: (userID) =>
    db.loadSafe(`SELECT w.*
                FROM users as u LEFT JOIN wallet as w ON u.WalletID = w.ID
                WHERE u.ID = ? `, [userID]),
}