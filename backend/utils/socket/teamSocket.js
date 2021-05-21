const teamModel = require('../../models/teamModel');
const team_has_model = require('../../models/TeamHasUserModel');
const config = require("../../config/default.json");

const { v4: uuidv4 } = require('uuid');
const { ISO_8601 } = require("moment");

module.exports = function (socket, io, decoded_userID) {

  // get team
  socket.on('get_team', async ({ walletID }, callback) => {
    socket.join(walletID);
    try {
      const team = await teamModel.getTeamByWalletId(walletID);
      if (team.length > 0) {
        const thu = await team_has_model.getTHUByTeamId(team[0].ID);
        callback({ team: team[0], thu: thu });
      }
      else {
        callback({ team: null, thu: 0 });
      }
    } catch (error) {
      console.log(error);
    }

  });
};
