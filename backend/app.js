const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config/default.json");
const createError = require('http-errors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

require('./middlewares/routes.mdw')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.listen(config.PORT, () => {
    console.log(`Backend APIs is running at http://localhost:${config.PORT}`)
})

