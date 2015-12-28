/* global clove */
/* jshint node: true */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var claimsCache = null;
    var Promise = require('promise');
    var Claim = sequelize.define("Claim", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.STRING
    }, {
        tableName: "tbl_claims",
        timestamps: true,
        classMethods: {
            associate: function (models) {
                Claim.belongsToMany(models.UserAppDomain, {
                    as: "userAppDomains",
                    through: models.UserAppDomainClaim,
                    foreignKey: "claimId"
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
                var claim = this;
                var bail = function (err) {
                    cb(err);
                };
                var errors = {};

                cb(null, clove.utils.equals(errors, {}) ? null : errors);

            }
        }
    });

    Claim.cache = function () {
        return new Promise(function (resolve, reject) {
            if (!claimsCache) {
                Claim.findAll().then(function (claims) {
                    var _tempCache = {};
                    claims.forEach(function (claim) {
                        if (claim.name.toLowerCase().indexOf("admin") > -1 &&
                            claim.name.toLowerCase().indexOf("domain") > -1) {
                            _tempCache.DOMAIN_ADMINS = claim;
                        } else if (claim.name.toLowerCase().indexOf("manager") > -1 &&
                            claim.name.toLowerCase().indexOf("domain") > -1) {
                            _tempCache.DOMAIN_MANAGERS = claim;
                        } else if (claim.name.toLowerCase().indexOf("user") > -1 &&
                            claim.name.toLowerCase().indexOf("domain") > -1) {
                            _tempCache.DOMAIN_USERS = claim;
                        }
                    });
                    claimsCache = _tempCache;
                    resolve(claimsCache);
                }).catch(reject);
            } else {
                resolve(claimsCache);
            }
        });
    };

    return Claim;
};
