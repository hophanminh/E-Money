const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config/default.json");
const createError = require('http-errors');
const passport = require('passport');
const http = require("http");
const socketIO = require('socket.io');
require('./utils/passport')(passport);

const URL = config.HOST.CURRENT;
const corsOptions = {
  // test
  origin: [URL]
};


const app = express();

// socket
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: [URL],
    methods: ["GET", "POST"]
  }
});
const ioConfig = require('./utils/socket')(io);
app.use(cors(corsOptions));

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

server.listen(process.env.PORT || config.PORT, () => {
  console.log(`Backend APIs is running at http://localhost:${config.PORT}`)
})

module.exports = io;