const express = require('express');
const router = express.Router();
const WalletModel = require('../models/walletModel');
const TeamModel = require('../models/teamModel');
const TeamHasUserModel = require('../models/TeamHasUserModel');
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

router.get('/:userId', async (req, res) => {
    console.log('Get teams belong to user');
    console.log(req.params.userId);
    const userID = req.params.userId;
    const teams = await TeamModel.getTeamsByUserId(userID);
    return res.status(200).send({teams});
})

router.get('/details/:teamID', async (req, res) => {
    console.log('Get teams belong to user');
    console.log(req.params.userId);
    const teamID = req.params.teamID;
    const teams = await TeamModel.getTeamById(teamID);
    return res.status(200).send({teams});
})

router.post('/:userID', async (req, res) => {
    console.log('Create team');
    const { Name, MaxUsers, Description } = req.body;
    const userID = req.params.userID;
    console.log(userID);
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
    console.log("Created Wallet " + newWallet.ID);

    const newTeam = {
        ID: uuidv1(),
        Name,
        MaxUsers,
        Description,
        CreatedDate: convertToRegularDateTime(new Date()),
        WalletID: newWallet.ID,
    };
    const team = await TeamModel.createTeam(newTeam);
    console.log(team)
    if (team.affectedRows !== 1) {
        return res.status(500)
            .send({ msg: "Please try again" });
    }
    console.log("Created Wallet " + newTeam.ID);

    const admin = {
        UserID: userID,
        TeamID: newTeam.ID,
        Role: config.PERMISSION.ADMIN,
        Status: config.STATUS.ACTIVE
    }
    const result = await TeamHasUserModel.createTHU(admin);

    if (result.affectedRows === 1) {
        console.log("Created successfully");
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

//TODO: Just admin can update
router.put('/details/:id', async (req, res) => {
    const teamId = req.params.id;
    const { Name, MaxUsers, Description, UserID } = req.body;
    console.log("Update teams " + teamId)
    const teamObject = await TeamModel.getTeamByIdAndUserId(teamId, UserID);

    if (teamObject.length === 0) {
        return res.status(400).send({ msg: "Không tìm thấy người dùng hoặc bạn không có quyền để cập nhật" })
    }

    const update = TeamModel.updateTeam(teamId, { Name, MaxUsers, Description });
    console.log(update);
    res.send(update);
});

router.post('/:id/delete', async (req, res) => {
    const teamId = req.params.id;
    console.log("delete teams " + teamId)
    const teamObject = await TeamModel.getTeamById(teamId);
    const { UserID } = req.body;

    if (teamObject.length === 0) {
        return res.status(400).send({ msg: "Không tìm thấy người dùng" })
    }

    const team = teamObject[0];
    console.log(teamId);
    console.log(team);
    console.log("Start delete thu")
    const c = await TeamHasUserModel.deleteTHU(team.ID, UserID)
    return res.status(200).send({msg: "success"})

});

router.post('/join/:userId', async (req, res) => {
    const userID = req.params.userId;
    const { teamID } = req.body
    console.log(`Invite user ${userID} joins team ${teamID}`);

    const team = await TeamModel.getTeamById(teamID);

    if(team.length === 0) {
        return res.status(404).send({msg: "Not found team"});
    }
    const thuObject = {
        TeamID: teamID,
        UserID: userID,
        Role: config.PERMISSION.MEMBER,
        Status: config.STATUS.ACTIVE
    }
    const result = await TeamHasUserModel.createTHU(thuObject);
    console.log(result.affectedRows)
    if (result.affectedRows === 1) {
        console.log("Joined successfully");
        return res.status(201)
            .send({ msg: "You are now a member of a team." });
    } else {
        return res.status(500)
            .send({ msg: "Please try again" });
    }
})

module.exports = router;