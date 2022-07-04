const express = require('express');
const PostValidator = require('../validator/PostValidator');
const PostController = require('../controllers/PostController');

const router = express.Router();
const auth = require('../middlewares/Auth');

const postController = new PostController();
const postValidator = new PostValidator();

router.get('/fetch/:where/:limit?', postValidator.postFetchValidator, postController.fetch);
router.post('/create', auth(), postValidator.postCreateValidator, postController.create);

module.exports = router;