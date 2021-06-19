const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {

  getAllTeam: () => {
    const sql = `SELECT * FROM Teams`;
    return db.load(sql);
  },

  getTeamsByUserId: (userId) => {
    const sql = `SELECT t.*, COUNT(thu2.UserID) AS CurrentUsers
                        FROM Teams t JOIN Teams_Has_Users thu on t.ID = thu.TeamID
                                    JOIN Teams_Has_Users thu2 on t.ID = thu2.TeamID
                        WHERE thu.Status = ${config.STATUS.ACTIVE} AND thu.UserID = '${userId}'
                        GROUP BY t.ID`;
    return db.load(sql);
  },

  getTeamByWalletId: (id) => {
    const sql = `SELECT * FROM Teams WHERE WalletID = '${id}'`;
    return db.load(sql);
  },
  getTeamById: (id) => {
    const sql = `SELECT * FROM Teams WHERE ID = '${id}'`;
    return db.load(sql);
  },
  getTeamByIdAndUserId: (teamId, userId) => {
    const sql = `SELECT t.*
        FROM Teams t JOIN Teams_Has_Users thu on t.ID = thu.TeamID 
        WHERE thu.Status = ${config.STATUS.ACTIVE} and thu.UserID = '${userId}' and thu.Role = ${config.PERMISSION.ADMIN} and t.ID = '${teamId}'`;
    return db.load(sql);
  },
  getMembersByTeamId: (teamID) => {
    const sql = `SELECT u.ID, u.Name, u.Username, t.Role 
        FROM Teams_Has_Users t 
        JOIN USERS u on t.UserID = u.ID
        WHERE t.TeamID = '${teamID}'
        ORDER BY t.Role DESC`
    return db.load(sql);
  },
  createTeam(newTeam) {
    return db.add('Teams', newTeam);
  },
  updateTeam(teamId, updateContent) {
    return db.patch('Teams', updateContent, { ID: teamId });
  },
  deleteTeam: (id) => {
    return db.delete('Teams', { ID: id })
  },
}