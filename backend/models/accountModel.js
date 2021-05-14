const db = require('../utils/database');

module.exports = {

  findById: id => db.load(`SELECT * FROM ResetRequests WHERE ID = '${id}' AND IsSuccessful = 0`),

  findByUserId: userId => db.load(`SELECT * FROM ResetRequests WHERE UserID = '${userId}' AND IsSuccessful = 0`),

  addRequest: entity => db.add('ResetRequests', entity),

  updateRequest: (id, entity) => db.patch('ResetRequests', entity, { ID: id }),
}