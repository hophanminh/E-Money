const { session } = require('passport');
const config = require('../config/default.json');

module.exports = (app, passport) => {
  app.use('/', require('../routes/routes'));
  app.use('/users', passport.authenticate("jwt", { session: false }), require('../routes/users'));
  app.use('/teams', passport.authenticate("jwt", { session: false }), require('../routes/teams'));
  app.use('/statistic', passport.authenticate("jwt", { session: false }), require('../routes/statistic'))

}