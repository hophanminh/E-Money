const db = require('../utils/database');

module.exports = {

    getTHUByUserId: (userId) => {
        const sql = `SELECT * from teams_has_users t WHERE t.UserID = '` + userId + `'`;
        return db.load(sql);
    },
    getTHUByTeamId: (id) => {
        const sql = `SELECT * from teams_has_users t WHERE t.TeamID = '` + id + `'`;
        return db.load(sql);
    },
    createTHU(newTeam) {
        return db.add('teams_has_users', newTeam);
    },
    updateTHU(teamId, userId, updateContent) {
        return db.patch('teams_has_users', updateContent, {TeamID: teamId, UserId: userId});
    },
    deleteTHU: (TeamID, UserID) => {
        const sql = `DELETE from teams_has_users WHERE TeamID = '` + TeamID + `' AND UserID = '` + UserID + `'`
        console.log(sql)
        return db.load(sql);

    }
}