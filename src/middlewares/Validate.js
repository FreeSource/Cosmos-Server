const httpStatus = require('http-status');
const responseHandler = require('../helper/responseHandler');

const check = (schema, property) => {

    return (req, res, next) => {

        /* Apply the following options to the schema. */
        const options = {
            abortEarly: false,  // Include all errors
            allowUnknown: true, // Ignore unknown props
            stripUnknown: true, // Remove unknown props
        };

        /* Validate the passed schema. */
        const { error } = schema.validate(req[property], options); 
        const valid = error === null; 
        if (valid) { 
            next(); 
        } else { 
            const { details } = error; 
            const validateError = details.map(i => i.message).join(',');

            const { code, status, message } = responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, validateError);
            res.status(422).json({ code, status, message });
        } 
    }
}

module.exports = {
    check
};