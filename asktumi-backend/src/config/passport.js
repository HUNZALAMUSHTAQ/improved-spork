const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');
// const FacebookStrategy = require('passport-facebook').Strategy;
// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};
const googleCredentials = {
  clientID: process.env.GOOGLE_SECRET_ID,
  clientSecret: process.env.GOOGLE_SECRET_KEY,
  callbackURL: 'http://localhost:3001/v1/auth/google/callback',
};

const googleVerify = async (accessToken, refreshToken, profile, done) => {
  // Handle user creation/updating in the database
  // ...
  console.log(profile, 'profile');
  return done(null, profile);
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
  // googleStrategy,
};
