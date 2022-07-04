const express = require('express');
const UserValidator = require('../validator/UserValidator');
const AuthController = require('../controllers/AuthController');

const router = express.Router();
const auth = require('../middlewares/Auth');

const authController = new AuthController();
const userValidator = new UserValidator();

router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshTokens);
router.post('/login', userValidator.userLoginValidator, authController.login);
router.post('/register', userValidator.userCreateValidator, authController.register);
router.post('/email-exists', userValidator.checkEmailValidator, authController.checkEmail);
router.put('/change-password', auth(), userValidator.changePasswordValidator, authController.changePassword);

module.exports = router;
