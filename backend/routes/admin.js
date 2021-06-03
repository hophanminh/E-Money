const express = require("express");
const router = express.Router();
const path = require('path');
router.use(express.static('public'));
const adminModel = require('../models/adminModel');
const { convertToRegularDate } = require('../utils/helper');

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const users = await adminModel.getAdminByID(id);
  
    if (users.length === 0) {
      return res.status(400).end();
    }
    const user = users[0];
    delete user.Password;
    return res.status(200).send({ user });
  });
  
  router.patch('/:id/info', async (req, res) => {
  
    const userID = req.params.id;
    const { Name, Email } = req.body;
    const result = await adminModel.updateAdmin(userID, { Name, Email });
  
    if (result.affectedRows === 1) {
      res.status(200).end();
    } else res.status(500).end();
  
  });
  
  router.patch('/:id/password', async (req, res) => {
    const userID = req.params.id;
    const { CurrentPassword, NewPassword } = req.body;
  
    const users = await adminModel.getAdminByID(userID);
  
    if (bcrypt.compareSync(CurrentPassword, users[0].Password)) { // old password is correct
      const N = config.hashRound;
      const hashedPassword = bcrypt.hashSync(NewPassword, N);
      const updateResult = await adminModel.updateAdmin(userID, { Password: hashedPassword });
  
      if (updateResult.affectedRows === 1) {
        res.status(200).end();
      } else {
        res.status(500).send({ msg: "Đã xảy ra sự cố khi cập nhật. Hãy thử lại!" });
      }
  
    } else {
      res.status(400).send({ msg: "Mật khẩu hiện tại không đúng" });
    }
  });
  
  module.exports = router;