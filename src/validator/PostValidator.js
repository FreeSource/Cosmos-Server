const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');
const { string, number } = require('joi');

class PostValidator {

    async postCreateValidator(req, res, next) {

        /* Create the base valid structure/schema. */
        const schema = Joi.object({
            title: Joi.string().required(),
            body: Joi.string().required(),
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

    async postFetchValidator(req, res, next) {
        /* Create the base valid structure/schema. */
        const schema = Joi.object({
            where: Joi.string(),
            limit: Joi.number(),
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

module.exports = PostValidator;
