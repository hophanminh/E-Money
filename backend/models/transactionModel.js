const db = require('../utils/database');

module.exports = {
  addTransaction: entity => db.add('exchanges', entity),

  updateTransaction: (id, updatedFields) => db.patch('exchanges', updatedFields, { ID: id }),

  deleteTransaction: (id) => db.delete(`exchanges`, { ID: id }),


  getTransactionFromWalletID: (walletID) =>
    db.loadSafe(`SELECT ex.ID as id, cat.ID as catID, cat.IconName as avatar, cat.Name as categoryName, 
    ex.Description as description, ex.Money as price, ex.DateAdded as time, events.ID as eventID, events.Name as eventName
                FROM exchanges as ex LEFT JOIN exchangetypes as cat ON ex.ExchangeTypeID = cat.ID
                                      LEFT JOIN events ON ex.EventID = events.ID
                WHERE ex.WalletID = ? 
                ORDER BY ex.DateAdded DESC`, [walletID]),


}