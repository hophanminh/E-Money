const db = require('../utils/database');
const config = require("../config/default.json");

module.exports = {

  getTHUByUserId: (userId) => {
    const sql = `SELECT * from teams_has_users t WHERE t.UserID = '${userId}'`;
    return db.load(sql);
  },
  getTHUByTeamId: (id) => {
    const sql = `SELECT t.*, Users.Name
                    FROM teams_has_users t JOIN Users on t.UserID = Users.ID
                    WHERE t.TeamID = '${id}'
                    ORDER BY t.Role DESC`;
    return db.load(sql);
  },

  getTHUByUserIdAndTeamID: (userId, teamID) => {
    return db.loadSafe(`SELECT * FROM
         teams_has_users t 
         WHERE t.UserID = ? AND t.TeamID = ?`, [userId, teamID]);
  },

  createTHU(newTeam) {
    return db.add('teams_has_users', newTeam);
  },
  updateTHU(teamId, userId, updateContent) {
    return db.patch('teams_has_users', updateContent, { TeamID: teamId, UserId: userId });
  },
  leaveTHU: (TeamID, UserID) => {
    const sql = `DELETE from teams_has_users WHERE TeamID = '${TeamID}' AND UserID = '${UserID}' AND Role <> ${config.PERMISSION.ADMIN} `
    return db.load(sql);

  },
  removeTHU: (TeamID, UserID) => {
    const sql = `DELETE from teams_has_users WHERE TeamID = '${TeamID}' AND UserID = '${UserID}' AND Role <> ${config.PERMISSION.ADMIN} `
    return db.load(sql);

  },
  deleteTHU: (TeamID) => {
    const sql = `DELETE from teams_has_users WHERE TeamID = '${TeamID}'`
    return db.load(sql);
  },
  GetMembersByTeamId: (teamID) => {
    const sql = `SELECT u.ID, u.Name, u.Username, t.Role 
        from teams_has_users t 
        join users u on t.UserID = u.ID
        WHERE t.TeamID = '${teamID}'
        ORDER BY t.Role DESC`
    return db.load(sql);
  }
}