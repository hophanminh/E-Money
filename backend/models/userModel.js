const db = require('../utils/database');

module.exports = {

  getPasswordByID: id => db.load(`SELECT Password FROM Users WHERE ID = '${id}' AND IsAdmin = 0`),

  getUserByID: id => db.load(`SELECT * FROM Users WHERE ID = '${id}'`),

  getNameByID: id => db.load(`SELECT Name FROM Users WHERE ID = '${id}'`),

  getUserByUserName: userName => db.load(`SELECT * FROM Users WHERE Username = '${userName}'`),

  getUserAvatarByID: id => db.load(`SELECT Avatar FROM Users WHERE ID = '${id}' AND IsAdmin = 0`),

  addUser: entity => db.add('Users', entity),

  updateUser: (id, updatedFields) => db.patch('Users', updatedFields, { ID: id }),
}