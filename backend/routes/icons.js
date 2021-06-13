const express = require("express");
const router = express.Router();
const iconModel = require('../models/IconModel');
const { ICON_NAMES } = require('../config/default.json');
router.use(express.static('public'));

router.get('/', async (req, res) => {
  const icons = await iconModel.getAllIcons();
  return res.status(200).send({ icons });
});

router.post('/list', async (req, res) => {
  console.log("List icons");
  try {
    const iconList = await iconModel.getAllIcons();
    return res.status(200).send(iconList);
  } catch (error) {
    return res.status(500).send();
  }
});

module.exports = router;