const Joi = require('Joi');

const schemas = {
    user: {
        register: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirm_password: Joi.string().valid(Joi.ref('password')).required(),
            username: Joi.string().min(3).max(32).required(),
            first_name: Joi.string(),
            last_name: Joi.string(),
        }),

        login: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        }),

        checkEmail: Joi.object({
            email: Joi.string().email().required(),
        }),

        changePassword: Joi.object({
            old_password: Joi.string().required(),
            new_password: Joi.string().min(6).required(),
            confirm_new_password: Joi.string().min(6).required(),
        }),
    },

    post: {
        create: Joi.object({
            title: Joi.string().required(),
            body: Joi.string().required(),
        }),

        get: Joi.object({
            where: Joi.string(),
            limit: Joi.number().min(1),
        }),
    },

};

module.exports = schemas;