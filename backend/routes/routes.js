const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Initial backend api");
})

router.get('/abc', ((req, res) =>{
    res.status(200).send('Here');
}))

module.exports = router;