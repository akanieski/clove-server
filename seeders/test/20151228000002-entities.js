"use strict";
/* jshint node: true */
var Promise = require("promise");
var async = require("async");
global.clove = require("../../app/core")();

var contact1 = {
    id: 1,
    firstName: "William",
    lastName: "Blackbeard",
    attention: "Billy Blackbeard",
    streetAddress: "123 Easy Street",
    city: "Tortuga",
    state: "TX",
    zipcode: "90210",
    country: "US",
    primaryPhone: "+018622664878",
    email: "andrewk@varsityg.com",
    updatedAt: new Date(),
    createdAt: new Date()
};
var contact2 = {
    id: 2,
    firstName: "Suzanne",
    lastName: "Blackbeard",
    attention: "Suzie Blackbeard",
    streetAddress: "123 Easy Street",
    streetAddress2: "Suite 7",
    city: "Tortuga",
    state: "TX",
    zipcode: "90210",
    country: "US",
    primaryPhone: "+018622664878",
    email: "andrewk@varsityg.com",
    updatedAt: new Date(),
    createdAt: new Date()
};
var entity1 = {
    id: 1,
    name: "East India Trading Company",
    description: "Rules the open seas",
    shippingContactId: 1,
    billingContactId: 2,
    updatedAt: new Date(),
    createdAt: new Date()
};

module.exports = {
    
    up: function (queryInterface, Sequelize) {
        return new Promise(function(resolve, reject) {
            async.series([
                function(next) {
                    queryInterface
                        .bulkInsert("tbl_contacts", [contact1, contact2], {}, clove.db.Contact.attributes)
                        .then(next);
                },
                function(next) {
                    queryInterface
                        .bulkInsert("tbl_entities", [entity1], {}, clove.db.Entity.attributes)
                        .then(next);
                }
            ], resolve);
        });
    },

    down: function (queryInterface, Sequelize) {
        return new Promise(function(resolve, reject) {
            async.series([
                function(next) {
                    queryInterface
                        .bulkDelete("tbl_contacts", [contact1, contact2])
                        .then(next);
                },
                function(next) {
                    queryInterface
                        .bulkDelete("tbl_contacts", [entity1])
                        .then(next);
                }
            ], resolve);
        });
    }
};
