const express = require("express");
const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const bcrypt = require('bcryptjs');
const { Base64 } = require("js-base64");
Base64.extendString();
const { v1: uuidv1 } = require('uuid');
const userModel = require('../models/userModel');
const walletModel = require('../models/walletModel');
const v1options = { msecs: Date.now() };
uuidv1(v1options);
const { convertToRegularDate, convertToRegularDateTime } = require('../utils/helper');
const router = express.Router();
const emailServer = require('../utils/email');

router.get("/", (req, res) => {
  res.send("Initial backend api");
});

router.post('/signin', async (req, res) => {
  const { Username, Password } = req.body;
  const users = await userModel.getUserByUserName(Username);

  if (users.length === 1) {
    const user = users[0];

    if (user.WalletID === null) { // chưa active  tài khoản qua email
      return res.status(401).send({ msg: "Tài khoản của bạn chưa kích hoạt. Hãy kiểm tra email để kích hoạt" });
    }

    if (bcrypt.compareSync(Password, user.Password)) {

      const token = jwt.sign({ id: user.ID }, config.PASSPORTKEY);

      return res.status(200).send({
        mesg: "Thành công", token, id: user.ID, name: user.Name
      });
    }
    else {
      return res.status(401).send({ msg: "Mật khẩu không chính xác. Hãy kiểm tra lại" });
    }
  }
  else {
    return res.status(400).send({ msg: 'Tài khoản không tồn tại' });
  }
});

router.post('/signup', async (req, res) => {

  const { Name, Username, Password, Email } = req.body;
  const user = await userModel.getUserByUserName(Username);

  if (user.length !== 0) {
    return res.status(400).send({ msg: 'Username has been used' });
  }
  const N = config.HASHROUND;
  const hashedPassword = bcrypt.hashSync(Password, N);

  const newUser = {
    ID: uuidv1(),
    Name,
    Username,
    Password: hashedPassword,
    Email,
  };

  const addUser = await userModel.addUser(newUser);

  if (addUser.affectedRows === 1) {
    const content =
      `<b>CHÀO MỪNG BẠN ĐẾN VỚI E-MONEY!</b><br>Hãy nhấn vào liên kết dưới đây để kích hoạt tài khoản của bạn.<br><a href="${config.APPLOCAL}/active/${newUser.ID.toBase64()}">Kích hoạt</a>`
    emailServer.send(newUser.Email, content, "Active your account on our app!");
    return res.status(201).send({ msg: "Please check your email to active your account." });
  } else {
    return res.status(500).send({ msg: "Please try again" });
  }
});

router.post('/active', async (req, res) => {
  const { ID } = req.body;
  const id = ID.fromBase64();
  const user = await userModel.getUserByID(id);

  if (user.length === 0) {
    return res.status(400).send({ msg: "Tài khoản không tồn tại." });
  }

  if (user[0].WalletID !== null) {
    return res.status(400).send({ msg: "Tài khoản của bạn đã được kích hoạt trước đó. Hãy tiếp tục sử dụng ứng dụng" });

  } else {

    const newWallet = {
      ID: uuidv1(),
      TotalCount: 0,
      CurrentIncomeCount: 0,
      CurrentSpentCount: 0,
      DateModified: convertToRegularDateTime(new Date())
    }

    const addWallet = await walletModel.addWallet(newWallet);
    // if (addWallet.affectedRows === 0) {

    // }
    const token = jwt.sign({ id }, config.PASSPORTKEY);
    const date = convertToRegularDate(new Date());

    await userModel.updateUser(id, { ActivatedDate: date, WalletID: newWallet.ID });
    return res.status(200).send({ msg: "Welcom to join our app", token, id, name: user[0].Name });
  }
})

router.get('/test', (req, res) => {

  console.log();
});

module.exports = router;