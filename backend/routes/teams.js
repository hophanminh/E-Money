const express = require('express');
const router = express.Router();
const WalletModel = require('../models/walletModel');
const TeamModel = require('../models/teamModel');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const config = require("../config/default.json");
const cloudinary = require('cloudinary').v2;
cloudinary.config(config.CLOUDINARY);
const {convertToRegularDateTime} = require("../utils/helper");
const { v1: uuidv1 } = require('uuid');
const v1options = { msecs: Date.now() };
uuidv1(v1options);
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));// make filename unique in images folder (if happen)
    },
    destination: function (req, file, cb) {
        cb(null, `./public/images/teamAvatars`);
    },
});
const upload = multer({ storage });

router.get('/', (req, res) => {
    console.log('Get teams belong to user');
    return res.status(200).send({})
})

router.post('/', async (req, res) => {
    console.log('Create team');

    const { Name, MaxUsers, Description } = req.body;

    const newWallet = {
        ID: uuidv1(),
        TotalCount: 0,
        CurrentIncomeCount: 0,
        CurrentSpentCount: 0,
        DateModified: convertToRegularDateTime(new Date())
    }
    const teamWallet = await WalletModel.addWallet(newWallet);

    if (teamWallet.affectedRows !== 1) {
        return res.status(500)
            .send({ msg: "Please try again" });
    }

    const newTeam = {
        ID: uuidv1(),
        Name,
        MaxUsers,
        Description,
        CreatedDate: convertToRegularDateTime(new Date()),
        WalletID: newWallet.ID,
    };

    const team = TeamModel.createTeam(newTeam);

    if (team.affectedRows === 1) {
        return res.status(201)
            .send({ msg: "Please check your email to active your account." });
    } else {
        return res.status(500)
            .send({ msg: "Please try again" });
    }
})

router.patch('/:id/avatar', upload.single('avatar'), async (req, res) => {
    const teamId = req.params.id;
    const teamObject = await TeamModel.getTeamById(teamId);

    if (teamObject.length === 0) {
        return res.status(400).send({ msg: "Không tìm thấy người dùng" })
    }

    const team = teamObject[0];

    if (team.AvatarURL !== null) {
        const firstIndex = team.AvatarURL.lastIndexOf("avatar/");
        const secondIndex = team.AvatarURL.lastIndexOf(".");
        const oldPublicId = team.AvatarURL.substring(firstIndex, secondIndex);
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
            await TeamModel.updateTeam(teamId, { AvatarURL: image.url });
            return res.status(200).json({ url: image.url });
        }
    )
});

router.patch('/:id/update', upload.single('avatar'), async (req, res) => {
    const teamId = req.params.id;
    console.log("Update teams " + teamId)
    const teamObject = await TeamModel.getTeamById(teamId);
    const { Name, MaxUsers, Description } = req.body;

    if (teamObject.length === 0) {
        return res.status(400).send({ msg: "Không tìm thấy người dùng" })
    }

    const update = TeamModel.updateTeam(teamId, { Name, MaxUsers, Description });
    console.log(update);
    res.send(update);
});

module.exports = router;