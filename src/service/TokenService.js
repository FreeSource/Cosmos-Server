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

        /* Verify token signature. */
        const payload = jwt.verify(token, config.jwt.secret, (err, decoded) => {
            return (err ? null : decoded);
        });

        /* Attempt to find token in the database. */
        if (payload !== null) {
            const tokenDoc = await this.tokenDao.findOne({
                token,
                type,
                user_uuid: payload.sub,
                blacklisted: false,
            });
    
            /* Otherwise, token is not found. */
            if (!tokenDoc) {
                return null
            }

            return tokenDoc;
        }

        return null;
    };

    saveToken = async (token, userId, expires, type, blacklisted = false) => {

        /* Save a singular token in the database. */
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

        /* Set expiration time for access token. */
        const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

        /* Generate the access token. */
        const accessToken = this.generateToken(
            user.uuid,
            accessTokenExpires,
            tokenTypes.ACCESS,
        );

        /* Set expiration for refresh token. */
        const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');

        /* Generate the refresh token. */
        const refreshToken = this.generateToken(
            user.uuid,
            refreshTokenExpires,
            tokenTypes.REFRESH,
        );
        
        /* Setup access token and refresh token storage. */
        const authTokens = [];

        /* Add refresh token to above array for storage. */
        authTokens.push({
            token: refreshToken,
            user_uuid: user.uuid,
            expires: refreshTokenExpires.toDate(),
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });

        /* Save the tokens array. */
        await this.saveMultipleTokens(authTokens);

        /* Find expired refresh token and remove. */
        const expiredRefreshTokenWhere = {
            expires: {
                [Op.lt]: moment(),
            },
            type: tokenTypes.REFRESH,
        };
        await this.tokenDao.remove(expiredRefreshTokenWhere);

        /* Return token data. */
        return {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        }
    };

    refreshAccessToken = async (user) => {

        /* Set expiration for refresh token. */
        const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

        /* Generate the refresh token. */
        const accessToken = this.generateToken(
            user.uuid,
            accessTokenExpires,
            tokenTypes.ACCESS,
        );

        /* Return refresh token. */
        return {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
        };
    };
}

module.exports = TokenService;
