const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {

  getAllTeam: () => {
    const sql = `SELECT * from teams`;
    return db.load(sql);
  },

  getTeamsByUserId: (userId) => {
    const sql = `SELECT t.*, COUNT(thu2.UserID) as CurrentUsers
                        FROM teams t join teams_has_users thu on t.ID = thu.TeamID
                                    join teams_has_users thu2 on t.ID = thu2.TeamID
                        WHERE thu.status = ${config.STATUS.ACTIVE} AND thu.UserID = '${userId}'
                        GROUP BY t.ID`;
    return db.load(sql);
  },

  getTeamByWalletId: (id) => {
    console.log("ID: ", id);
    const sql = `SELECT * from teams WHERE WalletID = '${id}'`;
    return db.load(sql);
  },
  getTeamById: (id) => {
    console.log("ID: ", id);
    const sql = `SELECT * from teams WHERE ID = '${id}'`;
    return db.load(sql);
  },
  getTeamByIdAndUserId: (teamId, userId) => {
    console.log("Team id: ", teamId);
    console.log("UserId: ", userId);
    const sql = `SELECT t.*
        FROM teams t JOIN teams_has_users thu on t.ID = thu.TeamID 

        WHERE thu.status = ${config.STATUS.ACTIVE} and thu.UserID = '${userId}' and thu.Role = ${config.PERMISSION.ADMIN} and t.ID = '${teamId}'`;
    return db.load(sql);
  },
  createTeam(newTeam) {
    return db.add('teams', newTeam);
  },
  updateTeam(teamId, updateContent) {
    return db.patch('teams', updateContent, { ID: teamId });
  },
  deleteTeam: (id) => {
    return db.delete('teams', { ID: id })
  },
}