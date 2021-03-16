const db = require('../utils/database');

module.exports = {
  addWallet: entity => db.add('wallets', entity),
  getWalletById: (id) => {
    const sql = `SELECT * from wallets t WHERE t.ID = '` + id + `'`;
  },
  getPrivateWallet: (userID) =>
    db.loadSafe(`SELECT w.*
                FROM users as u LEFT JOIN wallets as w ON u.WalletID = w.ID
                WHERE u.ID = ? `, [userID]),
  deleteWallet: (id) => {
    return db.delete('wallets', {ID: id})

  }
}