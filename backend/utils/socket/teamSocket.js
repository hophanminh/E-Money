const teamModel = require('../../models/teamModel');
const walletModel = require('../../models/walletModel');
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

  socket.on('get_wallet', async ({ ID }, callback) => {
    try {
      const selected = await walletModel.getWalletByID(ID);
      if (selected.length === 0) {
        return callback(null);
      }

      const wallet = await walletModel.getPrivateWallet(decoded_userID);
      if (wallet.length !== 0 && wallet[0].ID === selected[0].ID) {
        return callback(selected[0]);
      }

      const team = await teamModel.getTeamByWalletId(ID);
      if (team.length > 0) {
        const info = await team_has_model.getTHUByUserIdAndTeamID(decoded_userID, team[0].ID);
        if (info.length > 0) {
          return callback(selected);
        }
      }
      callback(null);
    } catch (error) {
      console.log(error);
    }

  });

};
