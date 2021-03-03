const { session } = require('passport');
const config = require('../config/default.json');

module.exports = (app, passport) => {
  app.use('/', require('../routes/routes'));
  app.use('/users', passport.authenticate("jwt", { session: false }), require('../routes/users'));
}