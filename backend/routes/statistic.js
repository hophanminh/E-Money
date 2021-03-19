const express = require("express");
const moment = require('moment');

const router = express.Router();
const statisticModel = require('../models/statisticModel');
router.use(express.static('public'));

router.post('/barChart', async (req, res) => {
  const { userID, date } = req.body;
  const month = moment(date).format("M");
  const year = moment(date).format("YYYY");
  const chartData = await statisticModel.getDataForBarChart(userID, month, year);

  if (chartData.length === 0) {
    return res.status(400).end();
  }

  if (chartData.length === 1) {
    if (chartData[0].Title === 'Thu') {
      chartData.push({ Title: 'Chi', Money: 0 });
    } else {
      chartData.push({ Title: 'Thu', Money: 0 });
    }
  }

  console.log(chartData);

  return res.status(200).send({ chartData });
});

router.post('/pieChart', async (req, res) => {
  const { userID, date, isSpent } = req.body;
  const month = moment(date).format("M");
  const year = moment(date).format("YYYY");
  const chartData = await statisticModel.getDataForPieChart(userID, month, year, isSpent);

  if (chartData.length === 0) {
    return res.status(400).end();
  }

  console.log(chartData);

  return res.status(200).send({ chartData });
});

module.exports = router;