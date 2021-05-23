const express = require("express");
const router = express.Router();
const path = require('path');
router.use(express.static('public'));


router.post('/defaultType', (req, res) => {
    console.log(req.body);
    const ID = uuidv4();
    const temp = {
        ID: ID,
        Name: newCategory.Name,
        IsDefault: true,
        WalletID: null,
        IconID: newCategory.IconID,
    }
    await categoryModel.addCategory(temp);
    return res.status(200).end();
  });
