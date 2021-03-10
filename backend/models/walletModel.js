const db = require('../utils/database');

module.exports = {
  addWallet: entity => db.add('Wallet', entity),
  getWalletById: (id) => {
    const sql = `SELECT * from wallet t WHERE t.ID = '` + id + `'`;
  },
  getPrivateWallet: (userID) =>
    db.loadSafe(`SELECT w.*
                FROM users as u LEFT JOIN wallet as w ON u.WalletID = w.ID
                WHERE u.ID = ? `, [userID]),
  deleteWallet: (id) => {
    const sql = `DELETE FROM wallet WHERE ID = '`+ id + `'`;
    return db.load(sql);
  }
}