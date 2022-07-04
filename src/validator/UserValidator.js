const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');

class UserValidator {

    async userCreateValidator(req, res, next) {

        /* Create the base valid structure/schema. */
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirm_password: Joi.string().valid(Joi.ref('password')).required(),
            username: Joi.string().min(3).max(32).required(),
            first_name: Joi.string(),
            last_name: Joi.string(),
        });

        /* Apply the following options to the above schema. */
        const options = {
            abortEarly: false,  // Include all errors
            allowUnknown: true, // Ignore unknown props
            stripUnknown: true, // Remove unknown props
        };

        /* Validate the base structure/schema against the above options. */
        const { error, value } = schema.validate(req.body, options);

        /* Check for any errors then map, otherwise, preform next task. */
        if (error) {
            const errorMessage = error.details.map((details) => {
                return details.message;
            }).join(', ');

            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }

    async userLoginValidator(req, res, next) {

        /* Create the base valid structure/schema. */
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        /* Apply the following options to the above schema. */
        const options = {
            abortEarly: false,  // Include all errors
            allowUnknown: true, // Ignore unknown props
            stripUnknown: true, // Remove unknown props
        };

        /* Validate the base structure/schema against the above options. */
        const { error, value } = schema.validate(req.body, options);

        /* Check for any errors then map, otherwise, preform next task. */
        if (error) {
            const errorMessage = error.details.map((details) => {
                return details.message;
            }).join(', ');

            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }

    async checkEmailValidator(req, res, next) {

        /* Create the base valid structure/schema. */
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        /* Apply the following options to the above schema. */
        const options = {
            abortEarly: false,  // Include all errors
            allowUnknown: true, // Ignore unknown props
            stripUnknown: true, // Remove unknown props
        };

        /* Validate the base structure/schema against the above options. */
        const { error, value } = schema.validate(req.body, options);

        /* Check for any errors then map, otherwise, preform next task. */
        if (error) {
            const errorMessage = error.details.map((details) => {
                return details.message;
            }).join(', ');

            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }

    async changePasswordValidator(req, res, next) {

        /* Create the base valid structure/schema. */
        const schema = Joi.object({
            old_password: Joi.string().required(),
            new_password: Joi.string().min(6).required(),
            confirm_new_password: Joi.string().min(6).required(),
        });

        /* Apply the following options to the above schema. */
        const options = {
            abortEarly: false,  // Include all errors
            allowUnknown: true, // Ignore unknown props
            stripUnknown: true, // Remove unknown props
        };

        /* Validate the base structure/schema against the above options. */
        const { error, value } = schema.validate(req.body, options);

        /* Check for any errors then map, otherwise, preform next task. */
        if (error) {
            const errorMessage = error.details.map((details) => {
                return details.message;
            }).join(', ');

            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }
}

module.exports = UserValidator;
