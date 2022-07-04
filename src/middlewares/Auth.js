const passport = require('passport');

const auth = () => {
    return async (req, res, next) => {
        return new Promise(() => {
            passport.authenticate('jwt', { session: false })(req, res, next);
        }).then(() => {
            return next();
        }).catch((err) => {
            return next(err);
        });
    };
};

module.exports = auth;