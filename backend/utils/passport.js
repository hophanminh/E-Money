const passportJWT = require('passport-jwt');
const userModel = require('../models/userModel');
const config = require('../config/default.json');
// const { convertISOToYMD } = require('../utils/helper');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.PASSPORTKEY
};
const JWT_strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  const user = await userModel.getUserByID(jwt_payload.id);
  if (user[0] !== null)
    return next(null, user[0]);
  else return next(null, false);
});

// use these strategy
module.exports = passport => {
  passport.use(JWT_strategy);
  // passport.use(FB_strategy);
}