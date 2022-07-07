'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('attempts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_uuid: {
                 allowNull: false,
                type: Sequelize.DataTypes.UUID,
            },
            ip: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            attempt_num: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            captured_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('attempts');
    }
};
