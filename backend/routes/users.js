const express = require("express");
const router = express.Router();


router.post('/authenticate', (req, res) => {
  console.log("authenticated");
  return res.status(200).end();
});

module.exports = router;