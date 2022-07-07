const config = require('./config');
const models = require('../models');
const UserDao = require('../dao/UserDao');
const { tokenTypes } = require('./constant');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const jwtOptions = {
    passReqToCallback: true,
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (req, payload, done) => {
    try { 
        if (payload.type !== tokenTypes.ACCESS) {
            throw new Error('Invalid token type.');
        }

        const userDao = new UserDao();
        const authorization = typeof req.headers.authorization !== "undefined" ? req.headers.authorization.split(' ') : [];

        if (typeof authorization[1] === "undefined") {
            return done(null, false);
        }

        const user = await userDao.findOneByWhere({ uuid: payload.sub });

        if (!user) {
            return done(null, false);
        }

        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
};