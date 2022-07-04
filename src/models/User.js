const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}

    User.init(
        {
            uuid: DataTypes.UUID,
            username: DataTypes.STRING,
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            status: DataTypes.INTEGER,
            role: DataTypes.INTEGER,
            email_verified: DataTypes.INTEGER,
            default_user: DataTypes.INTEGER,
            agency_id: DataTypes.INTEGER,
            address: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            google_id: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
            underscored: true,
        },
    );
    
    return User;
};
