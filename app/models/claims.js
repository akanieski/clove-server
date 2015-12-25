/* global clove */
/* jshint node: true */
"use strict";

module.exports = function (sequelize, DataTypes) {
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
                Claim.belongsToMany(models.UserAppDomain, { as: 'userAppDomains', through: models.UserAppDomainClaim , foreignKey: 'claimId' });
            }
        },
        instanceMethods: {
            isValid: function(options, cb) {
                if (typeof options === "function") {
                    cb = options;
                    options = {
                        /** Default options go here **/
                    };
                }
                var claim = this;
                var bail = function(err) {cb(err);};
                var errors = {};
                
                cb(null, clove.utils.equals(errors, {}) ? null : errors);
                
            }
        }
    });
    
    
    
    return Claim;
};