const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Attempt extends Model {}

    Attempt.init(
        {
            user_uuid: DataTypes.UUID,
            ip: DataTypes.STRING,
            attempt_num: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Attempt',
            underscored: true,
        },
    );
 
    return Attempt;
};
