const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const UserDao = require('../dao/UserDao');
const logger = require('../config/logger');
const TokenDao = require('../dao/TokenDao');
const AttemptDao = require('../dao/AttemptDao');
const { tokenTypes } = require('../config/constant');
const responseHandler = require('../helper/responseHandler');

class AuthService {
    constructor() {
        this.userDao = new UserDao();
        this.tokenDao = new TokenDao();
        this.attemptDao = new AttemptDao();
    }

    loginWithEmailPassword = async (email, password) => {
        try {

            /* Find user by email. */
            let user = await this.userDao.findByEmail(email);

            /* If email is not found, user must not exist or email is invalid. */
            if (user == null) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Invalid Email Address!');
            }

            /* Check if user password is valid. */
            const isPasswordValid = await bcrypt.compare(password, user.password);
            user = user.toJSON();
            delete user.password;

            /* If password is invalid, increment attempts and notify user. */
            if (!isPasswordValid) {
                var user_attempt = await this.attemptDao.findOne(user.uuid);

                if (user_attempt) {
                    let data = user_attempt.dataValues;
                    await this.attemptDao.updateWhere({ attempt_num: data.attempt_num++ }, {  });
                } else { 
                     await this.attemptDao.create({
                        user_uuid: user.uuid,
                        ip: 'lol',
                        attempt_num: 1
                    });
                }

                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Wrong Password!');
            }

            /* Login successful and return user data. */
            return responseHandler.returnSuccess(httpStatus.OK, 'Login Successful', user);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    };

    logout = async (req, res) => {

        /* Check for refresh token passed from body. */
        const refreshTokenDoc = await this.tokenDao.findOne({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });

        /* If the refresh token is invalid, no corresponding user. */
        if (!refreshTokenDoc) {
            res.status(httpStatus.NOT_FOUND).send({ message: 'User Not found!' });
        }

        /* 
        Remove the refresh token from database.
        Any access tokens that havent expired will still be valid upon logout!
        */
        await this.tokenDao.remove({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
    };
}

module.exports = AuthService;
