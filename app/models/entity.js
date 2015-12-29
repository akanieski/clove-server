/* jshint node: true */
"use strict";
module.exports = function (sequelize, DataTypes) {
    var Entity = sequelize.define("Entity", {
        name: DataTypes.STRING,
        description: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
                Entity.hasOne(models.Contact, {
                    as: "shippingContact",
                    foreignKey: "shippingContactId"
                });
                Entity.hasOne(models.Contact, {
                    as: "billingContact",
                    foreignKey: "billingContactId"
                });
            }
        },
        tableName: "tbl_entities",
        timestamps: true
    });
    return Entity;
};
