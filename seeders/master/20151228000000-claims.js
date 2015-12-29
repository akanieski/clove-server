"use strict";
/* jshint node: true */

var claims = [
    {
        id: 1,
        name: "Domain Admins",
        description: "Domain administrators",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        name: "Domain Managers",
        description: "Domain managers",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        name: "Domain Users",
        description: "Domain users",
        createdAt: new Date(),
        updatedAt: new Date()
    },
];

module.exports = {
    
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert("tbl_claims", claims, {});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete("tbl_claims", claims, {});
    }
};
