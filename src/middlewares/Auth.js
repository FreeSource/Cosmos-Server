const passport = require('passport');
const httpStatus = require('http-status');
const responseHandler = require('../helper/responseHandler');

const auth = () => {
    return (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                const { code, status, message } = responseHandler.returnError(httpStatus.UNAUTHORIZED, "Invalid or expired access token.");
                return res.status(code).send({ code, status, message });
            }
            
            req.user = user;
            return next();
        })(req, res, next);
    };
};

module.exports = auth;