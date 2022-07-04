const httpStatus = require('http-status');
const logger = require('../config/logger');
const AuthService = require('../service/AuthService');
const PostService = require('../service/PostService');
const UserService = require('../service/UserService');

class PostController {
    constructor() {
        this.postService = new PostService();
        this.userService = new UserService();
        this.authService = new AuthService();
    }

    create = async (req, res) => {
        try {

            /* Get the socket instance passed into the Express app. */
            // let io = req.app.get('io');

            /* Attempt to create the post. */
            const post = await this.postService.createPost(req.body, req.user.uuid);

            /* Extract details after attempting to create post. */
            const { status, message, data } = post.response;

            /* If post was created successfully, emit the new post event. */
            //if (status) {
                //io.emit('NEW_POST', data);
            //}
            
            /* Return JSON response. */
            let statusCode = post.statusCode;
            res.status(statusCode).send({ status, statusCode, message, data });

        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    fetch = async (req, res) => {

        /* Attempt to get public user posts. */
        const fetchPosts = await this.postService.fetchPosts(req.params.where, parseInt(req.params.limit));

        /* Extract details after attempting to fetch posts. */
        const { status, message, data } = fetchPosts.response;

        /* Return JSON response. */
        let statusCode = fetchPosts.statusCode;
        res.status(statusCode).send({ status, statusCode, message, data });
    }
}

module.exports = PostController;
