/* global clove */
/* jshint node: true */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var UserAppDomainClaim = sequelize.define("UserAppDomainClaim", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true
        }
    }, {
        tableName: "tbl_userappdomainclaims",
        timestamps: true,
        classMethods: {
            associate: function (models) {
                UserAppDomainClaim.belongsTo(models.Claim, {
                    foreignKey: "claimId",
                    as: "claim"
                });
                UserAppDomainClaim.belongsTo(models.UserAppDomain, {
                    foreignKey: "userAppDomainId",
                    as: "userAppDomain"
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
                var userAppDomainClaim = this;
                var bail = function (err) {
                    cb(err);
                };
                var errors = {};

                clove.db.UserAppDomainClaim.findOne({
                        where: {
                            claimId: userAppDomainClaim.claimId,
                            userAppDomainId: userAppDomainClaim.userAppDomainId
                        }
                    })
                    .then(function (u) {
                        if (u) {
                            errors.user_id = "Claim already assigned to this user";
                        }
                        cb(null, clove.utils.equals(errors, {}) ? null : errors);
                    }, bail);


            }
        }
    });



    return UserAppDomainClaim;
};
