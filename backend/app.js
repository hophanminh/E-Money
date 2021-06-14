const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config/default.json");
const createError = require('http-errors');
const passport = require('passport');
const http = require("http");
const socketIO = require('socket.io');
const app = express();
require('./utils/passport')(passport);

app.use(express.static("public"));
const URL = config.HOST.CURRENT;
// const corsOptions = {
//   // test
//   origin: [URL]
// };

// socket
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const ioConfig = require('./utils/socket/socket')(io, passport);

// app.use(cors(corsOptions));
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

require('./middlewares/routes.mdw')(app, passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

require('./utils/cron')(io);

server.listen(process.env.PORT || config.PORT, () => {
  console.log(`Backend APIs is running at http://localhost:${config.PORT}`);
});

module.exports = io;

// const moment = require("moment");
// const { convertToRegularDate, convertToRegularDateTime, getNextEventDate } = require('./utils/helper');
// const date = moment();
// const time = moment();
// time.hour(8);
// time.minute(10);
// const next = getNextEventDate(date, config.EVENT_TYPE.YEARLY, 13 * 1000 + 5, time);
// console.log(date.format('DD/MM/YYYY - hh:mm A'))
// console.log(next.format('DD/MM/YYYY - hh:mm A'))
