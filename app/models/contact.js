/* jshint node: true */
"use strict";
module.exports = function (sequelize, DataTypes) {
    var Contact = sequelize.define("Contact", {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        attention: DataTypes.STRING,
        streetAddress: DataTypes.STRING,
        streetAddress2: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        zipcode: DataTypes.STRING,
        country: DataTypes.STRING,
        primaryPhone: {
            type: DataTypes.STRING
        },
        secondaryPhone: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        website: {
            type: DataTypes.STRING
        },
    }, {
        classMethods: {
            associate: function (models) {

            }
        },
        tableName: "tbl_contacts",
        timestamps: true
    });
    return Contact;
};
