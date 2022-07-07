const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const UserDao = require('../dao/UserDao');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const { userConstant } = require('../config/constant');
const responseHandler = require('../helper/responseHandler');

class UserService {

    constructor() {
        this.userDao = new UserDao();
    }

    createUser = async (userBody) => {
        try {

            /* Check if email already exists. */
            if (await this.userDao.isEmailExists(userBody.email)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email already taken');
            }

            /* Set the current user values. */
            const uuid = uuidv4();
            userBody.email = userBody.email.toLowerCase();
            userBody.password = bcrypt.hashSync(userBody.password, 8);
            userBody.uuid = uuid;
            userBody.status = userConstant.STATUS_ACTIVE;
            userBody.email_verified = userConstant.EMAIL_VERIFIED_FALSE;
            userBody.default_user = userConstant.DEFAULT_USER_YES;
            userBody.role = 0;

            /* Create the user with the user body. */
            let userData = await this.userDao.create(userBody);

            /* Check if user creation failed. */
            if (!userData) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Registration Failed! Please Try again.');
            }

            /* Convert the user data to json and remove the user password to return below. */
            userData = userData.toJSON();
            delete userData.password;

            /* Return success and user data. */
            return responseHandler.returnSuccess(httpStatus.CREATED, 'Successfully Registered the account! Please Verify your email.', userData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    isEmailExists = async (email) => {

        /* Email is not found. */
        if (!(await this.userDao.isEmailExists(email))) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email not Found!!');
        }

        /* Otherwise, email is exists. */
        return responseHandler.returnSuccess(httpStatus.OK, 'Email found!');
    };

    getUserByUuid = async (uuid) => {
        return this.userDao.findOneByWhere({ uuid });
    };

    changePassword = async (data, uuid) => {
        
        /* Attempt to fetch the user by their UUID. */
        let user = await this.userDao.findOneByWhere({ uuid });

        /* Otherwise, the user is not found. */
        if (!user) {
            return responseHandler.returnError(httpStatus.NOT_FOUND, 'User Not found!');
        }

        /* Password and confirm password do not match. */
        if (data.password !== data.confirm_password) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Confirm password not matched');
        }

        /* Check if password is valid, and prepare user data for return. */
        const isPasswordValid = await bcrypt.compare(data.old_password, user.password);
        user = user.toJSON();
        delete user.password;

        /* The old password does not match. */
        if (!isPasswordValid) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Wrong old Password!');
        }

        /* Update the users password. */
        const updateUser = await this.userDao.updateWhere({ password: bcrypt.hashSync(data.new_password, 8) }, { uuid });

        /* Password update was successful. */
        if (updateUser) {
            return responseHandler.returnSuccess(httpStatus.OK, 'Password updated Successfully!', {});
        }

        /* Otherwise, password change failed. */
        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Password Update Failed!');
    };
}

module.exports = UserService;
 