const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {}

    Post.init(
        {
            user_uuid: DataTypes.UUID,
            author: DataTypes.STRING,
            author_url: DataTypes.STRING,
            title: DataTypes.STRING,
            body: DataTypes.TEXT,
            likes: DataTypes.INTEGER,
            saves: DataTypes.INTEGER,
            impressions: DataTypes.INTEGER,
        }, 
        {
            sequelize,
            modelName: 'Post',
            underscored: true,
        },
    );
 
    return Post;
};
