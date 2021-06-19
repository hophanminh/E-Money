const db = require('../utils/database');
const config = require("../config/default.json");

module.exports = {

  getTHUByUserId: (userId) => {
    const sql = `SELECT * FROM Teams_Has_Users t WHERE t.UserID = '${userId}'`;
    return db.load(sql);
  },
  getTHUByTeamId: (id) => {
    const sql = `SELECT t.*, u.Name
                    FROM Teams_Has_Users t JOIN Users u on t.UserID = u.ID
                    WHERE t.TeamID = ?
                    ORDER BY t.Role DESC`;
    return db.loadSafe(sql, [id]);
  },

  getTHUByUserIdAndTeamID: (userId, teamID) => {
    return db.loadSafe(`SELECT * FROM
    Teams_Has_Users t 
         WHERE t.UserID = ? AND t.TeamID = ?`, [userId, teamID]);
  },

  createTHU(newTeam) {
    return db.add('Teams_Has_Users', newTeam);
  },
  updateTHU(teamId, userId, updateContent) {
    return db.patch('Teams_Has_Users', updateContent, { TeamID: teamId, UserId: userId });
  },
  leaveTHU: (TeamID, UserID) => {
    const sql = `DELETE FROM Teams_Has_Users WHERE TeamID = '${TeamID}' AND UserID = '${UserID}' AND Role <> ${config.PERMISSION.ADMIN} `
    return db.load(sql);

  },
  removeTHU: (TeamID, UserID) => {
    const sql = `DELETE FROM Teams_Has_Users WHERE TeamID = '${TeamID}' AND UserID = '${UserID}' AND Role <> ${config.PERMISSION.ADMIN} `
    return db.load(sql);

  },
  deleteTHU: (TeamID) => {
    const sql = `DELETE FROM Teams_Has_Users WHERE TeamID = '${TeamID}'`
    return db.load(sql);
  }
}