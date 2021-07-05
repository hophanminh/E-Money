const express = require("express");
const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const bcrypt = require('bcryptjs');
const { Base64 } = require("js-base64");
Base64.extendString();
const userModel = require('../models/userModel');
const walletModel = require('../models/walletModel');
const accountModel = require('../models/accountModel');
const adminModel = require('../models/adminModel');
const { v1: uuidv1 } = require('uuid');
const v1options = { msecs: Date.now() };
uuidv1(v1options);
const { convertToRegularDate, convertToRegularDateTime } = require('../utils/helper');
const router = express.Router();
const emailServer = require('../utils/email');
const helper = require("../utils/helper");

router.get("/", (req, res) => {
  res.send("Initial backend api");
});

router.post('/signin', async (req, res) => {
  const { Username, Password } = req.body;
  const users = await userModel.getUserByUserName(Username);

  if (users.length === 1) {
    const user = users[0];

    // chưa active  tài khoản qua email
    if (user.WalletID === null) {
      return res.status(401).send({ msg: "Tài khoản của bạn chưa kích hoạt. Hãy kiểm tra Email để kích hoạt tài khoản." });
    }

    if (user.IsBanned === 1) {
      return res.status(403).send({ msg: "Tài khoản này tạm thời bị khóa bởi Admin. Hãy quay lại sau." });
    }

    if (bcrypt.compareSync(Password, user.Password)) {
      const token = jwt.sign({ id: user.ID }, config.PASSPORTKEY);
      delete user.Password;
      return res.status(200).send({ msg: "Thành công!", token, user });
    } else {
      return res.status(401).send({ msg: "Tên tài khoản hoặc mật khẩu không chính xác. Hãy kiểm tra lại." });
    }
  } else {
    return res.status(400).send({ msg: 'Tài khoản không tồn tại.' });
  }
});

router.post('/signup', async (req, res) => {
  const { Name, Username, Password, Email } = req.body;
  const user = await userModel.getUserByUserName(Username);

  if (user.length !== 0) {
    return res.status(400).send({ msg: 'Tên tài khoản đã được sử dụng.' });
  }

  const HASHROUND = config.HASHROUND;
  const hashedPassword = bcrypt.hashSync(Password, HASHROUND);

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
      `<b>CHÀO MỪNG BẠN ĐẾN VỚI E-MONEY!</b><br>Hãy nhấn vào liên kết dưới đây để kích hoạt tài khoản của bạn.<br><a href="${config.HOST.CURRENT}/active/${newUser.ID.toBase64()}">Kích hoạt</a>`
    const result = await emailServer.send(newUser.Email, content, "Kích hoạt tài khoản!");
    return res.status(201).send({ msg: "Hãy kiểm tra email vừa khai báo để kích hoạt tài khoản." });
  } else {
    return res.status(500).send({ msg: "Hãy thử lại!" });
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
    return res.status(403).send({ msg: "Tài khoản của bạn đã được kích hoạt trước đó. Hãy tiếp tục sử dụng ứng dụng." });
  } else {
    const newWallet = {
      ID: uuidv1(),
      TotalCount: 0,
      CurrentIncomeCount: 0,
      CurrentSpentCount: 0,
      DateModified: convertToRegularDateTime(new Date())
    }
    const addWallet = await walletModel.addWallet(newWallet);
    const token = jwt.sign({ id }, config.PASSPORTKEY);
    const date = convertToRegularDate(new Date());

    await userModel.updateUser(id, { ActivatedDate: date, WalletID: newWallet.ID });
    return res.status(200).send({ msg: "Chào mừng đến với E-Money", token, user: user[0] });
  }
})

router.post('/forgotpassword', async (req, res) => {
  const { Email, Username } = req.body;
  const users = await userModel.getUserByUserName(Username);

  // Không tìm thấy user
  if (users.length === 0) {
    return res.status(400).send({ msg: "Tài khoản không tồn tại" });
  }

  if (users[0].IsBanned === 1) {
    return res.status(403).send({ msg: "Tài khoản tạm thời bị khóa bởi Admin. Hãy quay lại sau." });
  }

  if (users[0].Email !== Email) {
    return res.status(400).send({ msg: "Email không trùng với Email đã đăng ký." });
  }

  const request = await accountModel.findByUserId(users[0].ID);

  // nếu có request trc đó mà chưa dc dùng để reset thì cập nhật isSuccessful = -1
  if (request.length !== 0) {
    await accountModel.updateRequest(request[0].ID, { IsSuccessful: -1 });
  }
  const newResetRequest = {
    ID: uuidv1(),
    UserID: users[0].ID,
    Code: helper.digitGeneration(6),
    Email,
    IsSuccessful: 0
  }
  const addResult = await accountModel.addRequest(newResetRequest);

  if (addResult.affectedRows === 1) {
    const content =
      `<div>Chào ${users[0].Username}!</div>
      <br/>Hãy sao chép đoạn mã sau để xác thực trên ứng dụng:
       <h4>${newResetRequest.Code}</h4>`
    const result = await emailServer.send(newResetRequest.Email, content, "Đặt lại mật khẩu!");

    return res.status(200).send({ msg: "Hãy kiểm tra email vừa khai báo để nhận mã xác thực.", id: newResetRequest.ID });
  } else {
    return res.status(500).send({ msg: "Hãy thử lại!" });
  }
});

router.post('/checkresetrequest', async (req, res) => {
  const result = await accountModel.findById(req.body.id);
  if (result.length === 1) {
    // thực hiện reset request
    res.status(200).end();
  } else {
    res.status(400).end();
  }
});

router.put('/resetpassword', async (req, res) => {
  const { Code, Password, ID } = req.body;
  try {
    const result = await accountModel.findById(ID);

    if (result.length === 1) {
      if (Code !== result[0].Code) {
        return res.status(400).send({ msg: "Mã xác nhận không đúng." });
      }

      const HASHROUND = config.hashRound;
      const hashedPassword = bcrypt.hashSync(Password, HASHROUND);
      const [reqStatusUpdateResult, passwordUpdateResult] = await Promise.all([
        accountModel.updateRequest(ID, { IsSuccessful: 1 }),
        userModel.updateUser(result[0].UserID, { Password: hashedPassword }),
      ])
      res.status(200).send({ msg: "Mật khẩu đã khôi phục thành công. Hãy đăng nhập để sử dụng tài khoản" });
    } else {
      res.status(401).end(); // spam
    }
  } catch (err) {
    res.status(500).send({ msg: "Hãy thử lại!" });
  }
});

router.post('/admin/signin', async (req, res) => {
  const { Username, Password } = req.body;
  const admins = await adminModel.getAdminByUserName(Username);

  if (admins.length === 1) {
    const admin = admins[0];

    if (bcrypt.compareSync(Password, admin.Password)) {
      const token = jwt.sign({ id: admin.ID }, config.PASSPORTKEY);
      delete admin.Password;
      return res.status(200).send({ msg: "Thành công!", token, user: admin });
    } else {
      return res.status(401).send({ msg: "Tên tài khoản hoặc mật khẩu không chính xác. Hãy kiểm tra lại." });
    }
  } else {
    return res.status(400).send({ msg: 'Tài khoản không tồn tại.' });
  }
});

router.post('/admin/forgotpassword', async (req, res) => {
  const { Email, Username } = req.body;
  const user = await adminModel.getAdminByUserName(Username);

  // Không tìm thấy user
  if (user.length === 0) {
    return res.status(400).send({ msg: "Tài khoản không tồn tại" });
  }

  const request = await accountModel.findByUserId(user[0].ID);

  // nếu có request trc đó mà chưa dc dùng để reset thì cập nhật isSuccessful = -1
  if (request.length !== 0) {
    await accountModel.updateRequest(request[0].ID, { IsSuccessful: -1 });
  }

  const newResetRequest = {
    ID: uuidv1(),
    UserID: user[0].ID,
    Code: helper.digitGeneration(6),
    Email,
    IsSuccessful: 0
  }

  const addResult = await accountModel.addRequest(newResetRequest);

  if (addResult.affectedRows === 1) {
    const content =
      `<div>Chào ${user[0].Username}!</div>
      <br/>Hãy sao chép đoạn mã sau để xác thực trên ứng dụng:
       <h4>${newResetRequest.Code}</h4>`
    const result = await emailServer.send(newResetRequest.Email, content, "Đặt lại mật khẩu!");
    return res.status(200).send({ msg: "Hãy kiểm tra email vừa khai báo để nhận mã xác thực.", id: newResetRequest.ID });
  } else {
    return res.status(500).send({ msg: "Hãy thử lại!" });
  }
});

router.put('/admin/resetpassword', async (req, res) => {
  const { Code, Password, ID } = req.body;
  try {
    const result = await accountModel.findById(ID);

    if (result.length === 1) {
      if (Code !== result[0].Code) {
        return res.status(400).send({ msg: "Mã xác nhận không đúng." });
      }

      const HASHROUND = config.hashRound;
      const hashedPassword = bcrypt.hashSync(Password, HASHROUND);
      const [reqStatusUpdateResult, passwordUpdateResult] = await Promise.all([
        accountModel.updateRequest(ID, { IsSuccessful: 1 }),
        adminModel.updateAdmin(result[0].UserID, { Password: hashedPassword }),
      ])
      res.status(200).send({ msg: "Mật khẩu đã khôi phục thành công. Hãy đăng nhập để sử dụng tài khoản" });
    } else {
      res.status(401).end(); // spam
    }
  } catch (err) {
    console.log("Error when reset password: ", err);
    res.status(500).send({ msg: "Hãy thử lại!" });
  }
})

module.exports = router;