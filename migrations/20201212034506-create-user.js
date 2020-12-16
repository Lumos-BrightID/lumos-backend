'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            contextId: {
                type: Sequelize.STRING,
                unique: true
            },
            telegram: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            twitter: {
                type: Sequelize.STRING,
                unique: true
                allowNull: true,
            },
            facebook: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            instagram: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            mobile: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            erc20Address: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
    }
};