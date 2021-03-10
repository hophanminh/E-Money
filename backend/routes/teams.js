const express = require('express');
const router = express.Router();
const WalletModel = require('../models/walletModel');
const TeamModel = require('../models/teamModel');
const {convertToRegularDateTime} = require("../utils/helper");
const { v1: uuidv1 } = require('uuid');
const v1options = { msecs: Date.now() };
uuidv1(v1options);

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

module.exports = router;