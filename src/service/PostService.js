const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const UserDao = require('../dao/UserDao');
const PostDao = require('../dao/PostDao');
const logger = require('../config/logger');
const responseHandler = require('../helper/responseHandler');

class PostService {
    constructor() {
        this.userDao = new UserDao();
        this.postDao = new PostDao(); 
    }

    createPost = async (data, uuid) => {
        try {

             /* Attempt to fetch the user by their UUID. */
            let user = await this.userDao.findOneByWhere({ uuid });

            /* Otherwise, the user is not found. */
            if (!user) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, 'User Not found!');
            }

            /* Create the post. */
            let post = await this.postDao.create({
                user_uuid: uuid,
                author: user.username,
                author_url: "In progress",
                title: data.title,
                body: data.body,
                likes: 0,
                saves: 0,
                impressions: 0,
            });

            /* Convert to JSON. */
            post = post.toJSON();

            /* Return response back to controller. */
            return responseHandler.returnSuccess(httpStatus.OK, 'Post created.', post);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    }

    fetchPosts = async (where, limit) => {
        try {

            /* Attempt to find posts relating to the URL `where` and `amount` parameters. */
            let found_posts = await this.postDao.findPostsFrom(where, limit);

             /* Return response back to controller. */
            if (found_posts.length > 0){
                return responseHandler.returnSuccess(httpStatus.OK, 'Fetched posts.', found_posts);
            } else {
                return responseHandler.returnSuccess(httpStatus.OK, `No posts found from: ${where}`);
            }

        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    }
}

module.exports = PostService;