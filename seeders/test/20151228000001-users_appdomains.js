"use strict";
/* global global */
/* global clove */
/* jshint node: true */

global.clove = require("../../app/core");
var Promise = require("promise");
var async = require("async");
var _ = require('lodash');


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
                updatedAt: new Date(),
                id: 1
            };
            var adminUser2 = {
                firstName: "System",
                lastName: "Administrator",
                username: "administrator2",
                password: clove.utils.encrypt("administrator"),
                email: "andrew.legacy2@gmail.com",
                active: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                id: 2
            };
            var basicUser1 = {
                firstName: "Basic",
                lastName: "User",
                username: "basicuser",
                password: clove.utils.encrypt("basicuser"),
                email: "basicuser@gmail.com",
                active: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                id: 3
            };
            var basicUser2 = {
                firstName: "Basic",
                lastName: "User 2",
                username: "basicuser2",
                password: clove.utils.encrypt("basicuser2"),
                email: "basicuser2@gmail.com",
                active: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                id: 4
            };
            var appDomain1 = {
                name: "Test App Domain",
                createdAt: new Date(),
                updatedAt: new Date(),
                id: 1
            };
            var appDomain2 = {
                name: "Colony of New Jersey",
                createdAt: new Date(),
                updatedAt: new Date(),
                id: 2
            };
            var appDomain3 = {
                name: "Colony of Virginia",
                createdAt: new Date(),
                updatedAt: new Date(),
                id: 3
            };
            var userAppDomain1 = {
                createdAt: new Date(),
                updatedAt: new Date(),
                id: 1
            };
            var userAppDomainClaim1 = {
                createdAt: new Date(),
                updatedAt: new Date(),
                id: 1
            };
            
            var getPk = function (value) {
                if (clove.config.dialect == 'sqlite') return value;
                if (_.isArray(value)) value = value[0];
                return value.id;
            }
            
            async.series([
                function(next) {
                    queryInterface.bulkInsert("tbl_users", [adminUser1], {returning: true}, clove.db.User.attributes).then(function(result) {
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_users", [adminUser2], {returning: true}, clove.db.User.attributes).then(function(result) {
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_users", [basicUser1], {returning: true}, clove.db.User.attributes).then(function(result) {
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_users", [basicUser2], {returning: true}, clove.db.User.attributes).then(function(result) {
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_appdomains", [appDomain1], {returning: true}, clove.db.AppDomain.attributes).then(function(result) {
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_appdomains", [appDomain2], {returning: true}, clove.db.AppDomain.attributes).then(function(result) {
                        next();
                    });
                },
                function(next) {
                    queryInterface.bulkInsert("tbl_appdomains", [appDomain3], {returning: true}, clove.db.AppDomain.attributes).then(function(result) {
                        next();
                    });
                },
                function(next) {
                    userAppDomain1.userId = adminUser1.id;
                    userAppDomain1.appDomainId = appDomain1.id;
                    queryInterface.bulkInsert("tbl_userappdomains", [userAppDomain1], {returning: true}, clove.db.UserAppDomain.attributes).then(function(result) {
                        next();
                    });
                },
                function(next) {
                    userAppDomainClaim1.claimId = 1;
                    userAppDomainClaim1.userAppDomainId = userAppDomain1.id;
                    console.error(userAppDomainClaim1);
                    queryInterface.bulkInsert("tbl_userappdomainclaims", [userAppDomainClaim1], {returning: true}, clove.db.UserAppDomainClaim.attributes).then(function(result) {
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
