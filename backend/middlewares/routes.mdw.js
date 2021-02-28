const config = require('../config/default.json');

module.exports = (app, passport) => {
  app.use('/', require('../routes/routes'));
}