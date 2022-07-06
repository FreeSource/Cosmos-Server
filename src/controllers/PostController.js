const httpStatus = require('http-status');
const logger = require('../config/logger');
const AuthService = require('../service/AuthService');
const PostService = require('../service/PostService');
const UserService = require('../service/UserService');
const responseHandler = require('../helper/responseHandler');

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
            let { code, status, message, data } = await this.postService.createPost(req.body, req.user.uuid);

            /* If post was created successfully, emit the new post event. */
            //if (status) {
                //io.emit('NEW_POST', data);
            //}
            
            /* Return JSON response. */
            res.status(code).json({ code, status, message, data });

        } catch (e) {
            logger.error(e);
            responseHandler.returnUnrecoverableError(req, res);
        }
    };

    fetch = async (req, res) => {
        try {

            /* Attempt to get public user posts. */
            let { code, status, message, data } = await this.postService.fetchPosts(req.params.where, parseInt(req.params.limit));

            /* Return JSON response. */
            res.status(code).json({ code, status, message, data });

        } catch(e) {
            logger.error(e);
            responseHandler.returnUnrecoverableError(req, res);
        }
    };
}

module.exports = PostController;
