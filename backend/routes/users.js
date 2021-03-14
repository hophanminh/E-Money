const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const config = require("../config/default.json");
const cloudinary = require('cloudinary').v2;
cloudinary.config(config.CLOUDINARY);
const multer = require('multer');
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));// make filename unique in images folder (if happen)
  },
  destination: function (req, file, cb) {
    cb(null, `./public/images/userAvatars`);
  },
});
const upload = multer({ storage });
const { convertToRegularDate } = require('../utils/helper');

router.use(express.static('public'));

router.post('/authenticate', (req, res) => {
  // console.log(req.user);
  console.log("authenticated");
  return res.status(200).end();
});

router.get('/:id', async (req, res) => {

  const id = req.params.id;
  const users = await userModel.getUserByID(id);

  if (users.length === 0) {
    return res.status(400).end();
  }
  const user = users[0];
  delete user.Password;
  return res.status(200).send({ user });
});

router.patch('/:id/info', async (req, res) => {

  const userID = req.params.id;
  const { Name, Email, DateOfBirth } = req.body;
  console.log(DateOfBirth);
  const formattedDOB = DateOfBirth ? convertToRegularDate(DateOfBirth) : null;
  const result = await userModel.updateUser(userID, { Name, Email, DateOfBirth: formattedDOB });

  if (result.affectedRows === 1) {
    res.status(200).end();
  } else res.status(500).end();

});

router.patch('/:id/password', async (req, res) => {
  const userID = req.params.id;
  const { CurrentPassword, NewPassword } = req.body;

  const users = await userModel.getUserByID(userID);

  // if (result.length === 1) {

  if (bcrypt.compareSync(CurrentPassword, users[0].Password)) { // old password is correct
    console.log('cmm');
    const N = config.hashRound;
    const hashedPassword = bcrypt.hashSync(NewPassword, N);
    const updateResult = await userModel.updateUser(userID, { Password: hashedPassword });

    if (updateResult.affectedRows === 1) {
      res.status(200).end();
    } else {
      res.status(500).send({ msg: "Đã xảy ra sự cố khi cập nhật. Hãy thử lại!" });
    }

  } else {
    res.status(400).send({ msg: "Mật khẩu hiện tại không đúng" });
  }
});

router.patch('/:id/avatar', upload.single('avatar'), async (req, res) => {
  const userID = req.params.id;
  const users = await userModel.getUserByID(userID);

  if (users.length === 0) {
    return res.status(400).send({ msg: "Không tìm thấy người dùng" })
  }

  const user = users[0];

  if (user.AvatarURL !== null) {
    const firstIndex = user.AvatarURL.lastIndexOf("avatar/");
    const secondIndex = user.AvatarURL.lastIndexOf(".");
    const oldPublicId = user.AvatarURL.substring(firstIndex, secondIndex);
    console.log(oldPublicId);
    cloudinary.uploader.destroy(oldPublicId, result => { console.log(result) });
  }

  const filePath = req.file.path;
  const uniqueFilename = Date.now();
  cloudinary.uploader.upload(
    filePath,
    {
      public_id: `avatar/${uniqueFilename}`,
      tags: 'avatar'
    },
    async (err, image) => {

      if (err) {
        return res.status(500).send({ msg: "Đã xảy ra sự cố khi tải lên ảnh của bạn. Hãy thử lại!" });
      }
      console.log('uploaded to cloudinary');
      console.log(image);
      fs.unlinkSync(filePath);
      await userModel.updateUser(userID, { AvatarURL: image.url });
      return res.status(200).json({ url: image.url });
    }
  )
});

module.exports = router;