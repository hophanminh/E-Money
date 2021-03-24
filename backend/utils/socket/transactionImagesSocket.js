const helperSocket = require("./helperSocket");
const transactionImagesModel = require('../../models/transactionImagesModel');
const { v4: uuidv4 } = require('uuid');

module.exports = function (socket, decoded_userID) {

  // get image from 1 transaction
  socket.on('get_transaction_image', async ({ TransactionID }, callback) => {
    try {
      const imageList = await transactionImagesModel.getImageByTransactionID(TransactionID);
      callback({ imageList });
    } catch (error) {
      console.log(error);
    }

  });

  socket.on('post_transaction_image', async (data) => {
    console.log('up hinh2 ne2');
    console.log(data);

    const express = require("express");
    const app = express();
    const fs = require('fs');
    const path = require('path');
    const moment = require('moment');
    const cloudinary = require('cloudinary').v2;
    const config = require('../../config/default.json');
    cloudinary.config(config.CLOUDINARY);
    const multer = require('multer');
    const storage = multer.diskStorage({
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));// make filename unique in images folder (if happen)
      },
      destination: function (req, file, cb) {
        cb(null, `./public/images/transactionImages`);
      },
    });
    const upload = multer({ storage }).single(data.Images);
    app.use(express.static('public'));

    console.log(data);

    app.post('/', (req, res) => {
      console.log(req.file);
    })


  })
};
