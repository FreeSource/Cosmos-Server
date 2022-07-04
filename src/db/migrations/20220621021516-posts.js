'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('posts', {
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
            author: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            author_url: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            body: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            likes: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            saves: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            impressions: {
                allowNull: false,
                type: Sequelize.INTEGER,
            }
        });
    }, 

    async down (queryInterface, Sequelize) {
        queryInterface.dropTable('posts');
    }
};
