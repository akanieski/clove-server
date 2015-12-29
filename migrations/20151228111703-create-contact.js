'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('tbl_contacts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            attention: {
                type: Sequelize.STRING
            },
            streetAddress: {
                type: Sequelize.STRING
            },
            streetAddress2: {
                type: Sequelize.STRING
            },
            city: {
                type: Sequelize.STRING
            },
            state: {
                type: Sequelize.STRING
            },
            zipcode: {
                type: Sequelize.STRING
            },
            country: {
                type: Sequelize.STRING
            },
            primaryPhone: {
                type: Sequelize.STRING
            },
            secondaryPhone: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            website: {
                type: Sequelize.STRING
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
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Contacts');
    }
};
