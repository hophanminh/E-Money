const db = require('../utils/database');

module.exports = {
  addWallet: entity => db.add('Wallet', entity),

}