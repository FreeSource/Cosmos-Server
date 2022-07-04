const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {}

    Token.init(
        {
            token: DataTypes.STRING,
            user_uuid: DataTypes.UUID,
            type: DataTypes.STRING,
            expires: DataTypes.DATE,
            blacklisted: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Token',
            underscored: true,
        },
    );
    
    return Token;
};
