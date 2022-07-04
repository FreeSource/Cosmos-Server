const moment = require('moment');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const config = require('../config/config');
const TokenDao = require('../dao/TokenDao');
const { tokenTypes } = require('../config/constant');

class TokenService {
    constructor() {
        this.tokenDao = new TokenDao();
    }

    generateToken = (uuid, expires, type, secret = config.jwt.secret) => {

        /* Options for creating the JWT token. */
        const payload = {
            sub: uuid,
            iat: moment().unix(),
            exp: expires.unix(),
            type,
        };

        /* Return the signed token. */
        return jwt.sign(payload, secret);
    };

    verifyToken = async (token, type) => {

        /* Verify the token signature. */
        const payload = await jwt.verify(token, config.jwt.secret, (err, decoded) => {
            if (err) {
                return false;
            }

            return true;
        });

        /* Attempt to find the token in the database. */
        const tokenDoc = await this.tokenDao.findOne({
            token,
            type,
            user_uuid: payload.sub,
            blacklisted: false,
        });

        /* Otherwise, token is not found. */
        if (!tokenDoc) {
            return false
        }

        return true;
    };

    saveToken = async (token, userId, expires, type, blacklisted = false) => {
        return this.tokenDao.create({
            token,
            user_id: userId,
            expires: expires.toDate(),
            type,
            blacklisted,
        });
    };

    saveMultipleTokens = async (tokens) => {
        return this.tokenDao.bulkCreate(tokens);
    };

    removeTokenById = async (id) => {
        return this.tokenDao.remove({ id });
    };

    generateAuthTokens = async (user) => {
        const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

        const accessToken = await this.generateToken(
            user.uuid,
            accessTokenExpires,
            tokenTypes.ACCESS,
        );

        const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
        const refreshToken = await this.generateToken(
            user.uuid,
            refreshTokenExpires,
            tokenTypes.REFRESH,
        );
        
        const authTokens = [];
        authTokens.push({
            token: accessToken,
            user_uuid: user.uuid,
            expires: accessTokenExpires.toDate(),
            type: tokenTypes.ACCESS,
            blacklisted: false,
        });

        authTokens.push({
            token: refreshToken,
            user_uuid: user.uuid,
            expires: refreshTokenExpires.toDate(),
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });

        await this.saveMultipleTokens(authTokens);
        const expiredAccessTokenWhere = {
            expires: {
                [Op.lt]: moment(),
            },
            type: tokenTypes.ACCESS,
        };

        await this.tokenDao.remove(expiredAccessTokenWhere);
        const expiredRefreshTokenWhere = {
            expires: {
                [Op.lt]: moment(),
            },
            type: tokenTypes.REFRESH,
        };
        
        await this.tokenDao.remove(expiredRefreshTokenWhere);
        const tokens = {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };

        return tokens;
    };
}

module.exports = TokenService;
