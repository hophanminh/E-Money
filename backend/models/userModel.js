const db = require('../utils/database');

module.exports = {
  getAllUsers: () => db.load(`
    SELECT
      ID AS id, Name AS name, Username AS username, Email AS email,
      DateOfBirth AS dateOfBirth, IsBanned AS isBanned
    FROM Users
  `),

  getPasswordByID: id => db.load(`SELECT Password FROM Users WHERE ID = '${id}' AND IsAdmin = 0`),

  getUserByID: id => db.load(`SELECT * FROM Users WHERE ID = '${id}'`),

  getUserByWalletID: walletID => db.loadSafe(`SELECT * FROM Users WHERE WalletID = ?`, [walletID]),

  getNameByID: id => db.load(`SELECT Name FROM Users WHERE ID = '${id}'`),

  getActivatedDateByID: id => db.load(`SELECT DATE_FORMAT(ActivatedDate, '%Y-%m-%d') AS ActivatedDate FROM Users WHERE ID = '${id}'`),

  getUserByUserName: userName => db.load(`SELECT * FROM Users WHERE Username = '${userName}'`),

  getUserAvatarByID: id => db.load(`SELECT Avatar FROM Users WHERE ID = '${id}' AND IsAdmin = 0`),

  addUser: entity => db.add('Users', entity),

  updateUser: (id, updatedFields) => db.patch('Users', updatedFields, { ID: id }),
}