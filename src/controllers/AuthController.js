const httpStatus = require('http-status');
const logger = require('../config/logger');
const { tokenTypes } = require('../config/constant');
const AuthService = require('../service/AuthService');
const UserService = require('../service/UserService');
const TokenService = require('../service/TokenService');
const responseHandler = require('../helper/responseHandler');

class AuthController {
    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
    }

    register = async (req, res) => {
        try {

            /* Attempt to create the user from serive. */
            const { code, status, message, data } = await this.userService.createUser(req.body);
            
            /* Create tokens dictionary. */
            let tokens = {};

            /* If creating the user was successful, generate corresponding auth tokens. */
            if (status) {
                tokens = await this.tokenService.generateAuthTokens(data);
            }

            /* Return created user data and tokens. */
            res.status(code).json({ code, status, message, data, tokens });
        } catch (e) {
            logger.error(e);
            responseHandler.returnUnrecoverableError(req, res);
        }
    };

    checkEmail = async (req, res) => {
        try {

            /* Check if user email exists. */
            const isExists = await this.userService.isEmailExists(req.body.email.toLowerCase());

            /* TODO */
            res.status(isExists.statusCode).send(isExists.response);
        } catch (e) {
            logger.error(e);
            responseHandler.returnUnrecoverableError(req, res);
        }
    };

    login = async (req, res) => {
        try {

            /* Get fields from body. */
            const { email, password } = req.body;

            /* Attempt to login with auth service. */
            const { code, status, message, data } = await this.authService.loginWithEmailPassword(email.toLowerCase(), password);

            /* Create tokens dictionary. */
            let tokens = {};

            /* Check if login was successful and generate auth tokens. */
            if (status) {
                tokens = await this.tokenService.generateAuthTokens(data);
            }

            /* Return created user data and tokens. */
            res.status(code).json({ code, status, message, data, tokens });
        } catch (e) {
            logger.error(e);
            responseHandler.returnUnrecoverableError(req, res);
        }
    };
 
    logout = async (req, res) => {
        await this.authService.logout(req, res);
        res.status(httpStatus.NO_CONTENT).send();
    };

    refreshTokens = async (req, res) => {
        try {

            /* Verify the refresh token. */
            const refreshTokenDoc = await this.tokenService.verifyToken(
                req.body.refresh_token,
                tokenTypes.REFRESH,
            );

            /* Check if we got a result back from verifying the refresh token. */
            if (refreshTokenDoc !== null) {

                /* Attempt to fetch the user. */
                const user = await this.userService.getUserByUuid(refreshTokenDoc.user_uuid);
                if (user === null) {
                    let { code, status, message } = responseHandler.returnError(httpStatus, 'Could not refresh token, user not found.');
                    res.status(code).json({ code, status, message });
                }

                /* Specifically refresh the access token only. */
                const tokens = await this.tokenService.refreshAccessToken(user);
            
                /* Return refreshed access token and data. */
                let { code, status, message } = responseHandler.returnSuccess(httpStatus.OK, 'Successfully refreshed access token.');
                res.status(code).json({ code, status, message, tokens });
            } else {
                let { code, status, message } = responseHandler.returnError(httpStatus.FORBIDDEN, 'Invalid refresh token.');
                res.status(code).json({ code, status, message });
            }
        } catch (e) {
            logger.error(e);
            responseHandler.returnUnrecoverableError(req, res);
        }
    };

    changePassword = async (req, res) => {
        try {

            /* Chnage password with user service. */
            const responseData = await this.userService.changePassword(req.body, req.user.uuid);

            /* Return changed password data. */
            res.status(responseData.statusCode).json(responseData.response);
        } catch (e) {
            logger.error(e);
            responseHandler.returnUnrecoverableError(req, res);
        }
    };
}

module.exports = AuthController;
