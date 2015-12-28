/* global clove */
/* jshint node: true */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var AppDomain = sequelize.define("AppDomain", {
        name: DataTypes.STRING,
    }, {
        tableName: "tbl_appdomains",
        timestamps: true,
        classMethods: {
            associate: function (models) {
                AppDomain.belongsToMany(models.User, {
                    as: "users",
                    through: models.UserAppDomain,
                    foreignKey: "appDomainId"
                });
                AppDomain.hasMany(models.UserAppDomain, {
                    as: "userAppDomains",
                    foreignKey: "appDomainId"
                });
            }
        },
        instanceMethods: {
            isValid: function (options, cb) {
                if (typeof options === "function") {
                    cb = options;
                    options = {
                        /** Default options go here **/
                    };
                }
                var appDomain = this;
                var bail = function (err) {
                    cb(err);
                };
                var errors = {};
                if (!appDomain.name) {
                    errors.name = "Name is required";
                }

                cb(null, clove.utils.equals(errors, {}) ? null : errors);
            }
        }
    });



    return AppDomain;
};
