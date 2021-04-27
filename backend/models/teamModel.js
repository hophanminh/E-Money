const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
    getTeamsByUserId: (userId) => {
        const sql = `SELECT t.* 
                        FROM teams t join teams_has_users thu on t.ID = thu.TeamID
                        WHERE thu.status = ${config.STATUS.ACTIVE} AND thu.UserID = '${userId}'`;
        return db.load(sql);
    },
    getTeamByWalletId: (walletId) => {
        const sql = `SELECT * from teams t WHERE t.WalletID = ?`
        return db.loadSafe(sql, [walletId]);
    },
    getTeamById: (id) => {
        console.log("ID: ", id);
        const sql = `SELECT * from teams WHERE ID = '${id}'`;
        console.log(sql);
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