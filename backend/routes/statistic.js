const express = require("express");
const moment = require('moment');
const router = express.Router();
const statisticModel = require('../models/statisticModel');
router.use(express.static('public'));

router.post('/barChart', async (req, res) => {
  const { userID, teamID, date } = req.body;
  const month = moment(date).format("M");
  const year = moment(date).format("YYYY");
  let chartData;

  if (userID) {
    chartData = await statisticModel.getDataForBarChart(userID, month, year);
  }

  if (teamID) {
    chartData = await statisticModel.getDataForTeamBarChart(teamID, month, year);
  }

  if (chartData.length === 0) {
    chartData.push({ Title: 'Chi', Money: 0 });
    chartData.push({ Title: 'Thu', Money: 0 });
  } else if (chartData.length === 1) {
    if (chartData[0].Title === 'Chi') {
      chartData.push({ Title: 'Thu', Money: 0 });
    } else {
      chartData.splice(0, 0, { Title: 'Chi', Money: 0 });
    }
  }

  return res.status(200).send({ chartData });
});

router.post('/pieChart', async (req, res) => {
  const { userID, teamID, date, isSpent } = req.body;
  const month = moment(date).format("M");
  const year = moment(date).format("YYYY");
  let chartData;

  if (userID) {
    chartData = await statisticModel.getDataForPieChart(userID, month, year, isSpent);
  }

  if (teamID) {
    chartData = await statisticModel.getDataForTeamPieChart(teamID, month, year, isSpent);
  }

  if (chartData.length === 0) {
    return res.status(400).end();
  }

  return res.status(200).send({ chartData });
});

module.exports = router;
