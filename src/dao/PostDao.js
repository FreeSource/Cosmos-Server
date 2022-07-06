const SuperDao = require('./SuperDao');
const models = require('../models');

const Post = models.Post;

class PostDao extends SuperDao {
    constructor() {
        super(Post);
    }

    async findPostsFrom(location, amount){
        return Post.findAll({where: {author: location},
            raw: true,
            nest: true,
            limit: amount,
            attributes: { exclude: ['user_uuid'] },
        });
    }
}

module.exports = PostDao; 
