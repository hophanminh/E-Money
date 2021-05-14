const express = require("express");
const moment = require('moment');

const router = express.Router();
const iconModel = require('../models/IconModel');
router.use(express.static('public'));

router.post('/list', async (req, res) => {
  console.log("List icons");
  try {
    const iconList = await iconModel.getAllIcon();
    return res.status(200).send(iconList);
  } catch (error) {
    return res.status(500).send();
  }
});


module.exports = router;