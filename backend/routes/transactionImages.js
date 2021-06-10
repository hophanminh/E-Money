const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const transactionImagesModel = require('../models/transactionImagesModel');
const { v1: uuidv1, v1 } = require('uuid');
const v1options = { msecs: Date.now() };
uuidv1(v1options);
const config = require("../config/default.json");
const cloudinary = require('cloudinary').v2;
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
const upload = multer({ storage });
const { convertToRegularDateTime } = require('../utils/helper');
router.use(express.static('public'));

router.post('/', upload.array('images', 5), async (req, res) => {
  const transactionID = req.query.transactionID;
  const files = req.files;
  const urls = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = file.path;
      const uniqueFilename = Date.now();
      const publicID = `transactionImages/${uniqueFilename}`;
      await cloudinary.uploader.upload(
        filePath,
        {
          quality: 80,
          timeout: 60000,
          public_id: publicID,
          tags: 'transactionImages',
        },
        (err, image) => {
          if (err) { return res.status(500).send({ msg: "Đã xảy ra sự cố khi tải lên ảnh của bạn. Hãy thử lại!" }); }
          console.log('uploaded to cloudinary');
          const newImage = {
            ID: uuidv1(),
            URL: image.secure_url,
            TransactionID: transactionID,
            DateAdded: convertToRegularDateTime(uniqueFilename),
            PublicID: image.public_id
          }
          console.log(newImage);
          fs.unlink(filePath, err => { if (err) console.log(err) });// run this cmd asynchronously
          urls.push(newImage);
        }
      )
    };

    for (let i = 0; i < urls.length; i++) {
      await transactionImagesModel.addImage(urls[i]);
    };

  } catch (err) {
    console.log("Upload transaction img error: ", err);
  }
  return res.status(200).send({ urls });

});

router.delete('/:id', async (req, res) => {

  const imageID = req.params.id;

  try {
    const images = await transactionImagesModel.getImageByID(imageID);

    if (images.length !== 1) {
      throw new Error('Image not found by given id');
    }

    const removed = await cloudinary.uploader.destroy(images[0].PublicID);

    if (removed.result !== 'ok') {
      throw new Error('given public id is incorrect');
    }

    await transactionImagesModel.deleteImage(imageID);
  } catch (err) {
    console.log("Delete transaction img error: ", err);
    return res.status(500).send({ msg: 'Đã xảy ra sự cố. Hãy thử lại!' });
  }
  return res.status(200).end();
})

module.exports = router;