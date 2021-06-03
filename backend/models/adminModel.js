const db = require('../utils/database');

module.exports = {

  getPasswordByID: id => db.load(`SELECT Password FROM Admins WHERE ID = '${id}' AND IsAdmin = 0`),

  getAdminByID: id => db.load(`SELECT * FROM Admins WHERE ID = '${id}'`),

  getNameByID: id => db.load(`SELECT Name FROM Admins WHERE ID = '${id}'`),

  getActivatedDateByID: id => db.load(`SELECT DATE_FORMAT(ActivatedDate, '%Y-%m-%d') AS ActivatedDate FROM Admins WHERE ID = '${id}'`),

  getAdminByUserName: userName => db.load(`SELECT * FROM Admins WHERE Username = '${userName}'`),

  addAdmin: entity => db.add('Admins', entity),

  updateAdmin: (id, updatedFields) => db.patch('Admins', updatedFields, { ID: id }),
}