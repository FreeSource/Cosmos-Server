const express = require('express');
const Validate = require('../middlewares/Validate');
const ValidatorSchema = require('../validator/Schemas');
const PostController = require('../controllers/PostController');

const router = express.Router();
const auth = require('../middlewares/Auth');

const postController = new PostController();

router.get('/get/:where/:limit?', Validate.check(ValidatorSchema.post.get, 'params'), postController.fetch);
router.post('/create', auth(), Validate.check(ValidatorSchema.post.create, 'body'), postController.create);

module.exports = router;