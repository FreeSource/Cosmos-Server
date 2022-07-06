const express = require('express');
const Validate = require('../middlewares/Validate');
const ValidatorSchema = require('../validator/Schemas');
const AuthController = require('../controllers/AuthController');

const router = express.Router();
const auth = require('../middlewares/Auth');

const authController = new AuthController();

router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshTokens);
router.post('/login', Validate.check(ValidatorSchema.user.login, 'body'), authController.login);
router.post('/register', Validate.check(ValidatorSchema.user.register, 'body'), authController.register);
router.post('/email-exists', Validate.check(ValidatorSchema.user.checkEmail, 'body'), authController.checkEmail);
router.put('/change-password', auth(), Validate.check(ValidatorSchema.user.changePassword, 'body'), authController.changePassword);

module.exports = router;
