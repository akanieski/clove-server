'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('tbl_entities', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            billingContactId: {
                type: Sequelize.BIGINT,
                reference: "tbl_contacts",
                referenceKey: "id"
            },
            shippingContactId: {
                type: Sequelize.BIGINT,
                reference: "tbl_contacts",
                referenceKey: "id"
            },
            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
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
        return queryInterface.dropTable('Entities');
    }
};
