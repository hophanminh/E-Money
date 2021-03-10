const db = require('../utils/database');

module.exports = {
    getTeamsByUserId: (userId) => {
        const sql = `SELECT * from teams_has_users tu WHERE tu.UserID = ${userId}`
        return db.load(sql);
    },
    getTeamByWalletId: (walletId) => {
        const sql = `SELECT * from teams t WHERE t.WalletID = ${walletId}`
        return db.load(sql);
    },
    getTeamById: (id) => {
        const sql = `SELECT * from teams t WHERE t.ID = '` + id + `'`;
        return db.load(sql);
    },
    createTeam(newTeam) {
        return db.add('teams', newTeam);
    },
    updateTeam(teamId, updateContent) {
        return db.patch('teams', updateContent, {ID: teamId});
    },
    deleteTeam: (id) => {
        const sql = `DELETE FROM teams WHERE ID = '`+ id + `'`;
        return db.load(sql);
    }
}