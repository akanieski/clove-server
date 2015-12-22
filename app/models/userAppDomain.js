/* global clove */
/* jshint node: true */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var UserAppDomain = sequelize.define("UserAppDomain", {
        
    }, {
        tableName: "tbl_userappdomains",
        timestamps: true,
        classMethods: {
            associate: function (models) {
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
                var userAppDomain = this;
                var bail = function(err) {cb(err);};
                var errors = {};
                
                clove.db.UserAppDomain.findOne({where: {
                    user_id: userAppDomain.user_id, 
                    appdomain_id: userAppDomain.appdomain_id
                }})
                    .then(function(u) {
                        if (u) {
                            errors.user_id = "User already associated with this app domain";
                        }
                        cb(null, clove.utils.equals(errors, {}) ? null : errors); 
                    }, bail);
                
                
            }
        }
    });
    
    
    
    return UserAppDomain;
};