"use strict";
/* global global */
/* global clove */
/* jshint node: true */

global.clove = require("../../app/core");
var Promise = require("promise");
var async = require("async");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return new Promise(function (resolve, reject) {
            var adminUser1 = {
                firstName: "System",
                lastName: "Administrator",
                username: "administrator",
                password: clove.utils.encrypt("administrator"),
                email: "andrew.legacy@gmail.com",
                active: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            var adminUser2 = {
                firstName: "System",
                lastName: "Administrator",
                username: "administrator2",
                password: clove.utils.encrypt("administrator"),
                email: "andrew.legacy2@gmail.com",
                active: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            var basicUser1 = {
                firstName: "Basic",
                lastName: "User",
                username: "basicuser",
                password: clove.utils.encrypt("basicuser"),
                email: "basicuser@gmail.com",
                active: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            var basicUser2 = {
                firstName: "Basic",
                lastName: "User 2",
                username: "basicuser2",
                password: clove.utils.encrypt("basicuser2"),
                email: "basicuser2@gmail.com",
                active: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            var appDomain1 = {
                name: "Test App Domain",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            var appDomain2 = {
                name: "Colony of New Jersey",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            var appDomain3 = {
                name: "Colony of Virginia",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            var userAppDomain1 = {
                createdAt: new Date(),
                updatedAt: new Date()
            };
            var userAppDomainClaim1 = {
                createdAt: new Date(),
                updatedAt: new Date()
            };
            async.series([
                function(next) {
                    queryInterface.bulkInsert("tbl_users", [adminUser1]).then(function(result) {
                        adminUser1.id = result;
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_users", [adminUser2]).then(function(result) {
                        adminUser2.id = result;
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_users", [basicUser1]).then(function(result) {
                        basicUser1.id = result;
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_users", [basicUser2]).then(function(result) {
                        basicUser2.id = result;
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_appdomains", [appDomain1]).then(function(result) {
                        appDomain1.id = result;
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_appdomains", [appDomain2]).then(function(result) {
                        appDomain2.id = result;
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_appdomains", [appDomain3]).then(function(result) {
                        appDomain3.id = result;
                        next();
                    });
                },
                function(next) {
                    userAppDomain1.userId = adminUser1.id;
                    userAppDomain1.appDomainId = appDomain1.id;
                    queryInterface.bulkInsert("tbl_userappdomains", [userAppDomain1]).then(function(result) {
                        userAppDomain1.id = result;
                        next();
                    });
                },
                function(next) {
                    userAppDomainClaim1.claimId = 1;
                    userAppDomainClaim1.userAppDomainId = userAppDomain1.id;
                    queryInterface.bulkInsert("tbl_userappdomainclaims", [userAppDomainClaim1]).then(function(result) {
                        userAppDomainClaim1.id = result;
                        next();
                    });
                },
            ], function() {
                // Do anything else here
                resolve();
            });
        });
    },

    down: function (queryInterface, Sequelize) {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('Person', null, {});
        */
    }
};
