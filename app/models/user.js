/* global clove */
/* jshint node: true */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },
    }, {
        tableName: "tbl_users",
        timestamps: true,
        classMethods: {
            associate: function (models) {
                User.belongsToMany(models.AppDomain, {
                    as: "appDomains",
                    through: models.UserAppDomain,
                    foreignKey: "userId"
                });
                User.hasMany(models.UserAppDomain, {
                    as: "userAppDomains",
                    foreignKey: "userId"
                });
                User.belongsTo(models.AppDomain, {
                    as: "defaultAppDomain",
                    foreignKey: "defaultAppDomainId"
                });
            }
        },
        instanceMethods: {
            isValid: function (options, cb) {
                if (typeof options === "function") {
                    cb = options;
                    options = {
                        confirmPassword: false
                    };
                }
                var user = this;
                var bail = function (err) {
                    cb(err);
                };
                var errors = {};
                if (!user.firstName) {
                    errors.firstName = "First name is required";
                }
                if (!user.lastName) {
                    errors.lastName = "Last name is required";
                }
                if (!user.username) {
                    errors.username = "Username is required";
                }
                if (!user.email) {
                    errors.email = "Email is required";
                }
                if (!clove.utils.check_email(user.email)) {
                    errors.email = "Email is not valid";
                }
                if (clove.utils.check_password(this.password)) {
                    errors.password = clove.utils.check_password(this.password);
                }

                if (options.confirmPassword && this.password !== options.confirmation) {
                    errors.password2 = "Password confirmation does not match";
                }

                clove.async.series([
                    function CheckExistingUsername(done) {
                        if (errors.username) {
                            done();
                        } else {
                            clove.db.User.findOne({
                                    where: {
                                        username: user.username
                                    }
                                })
                                .then(function (u) {
                                    if (u) {
                                        errors.username = "Username already in use";
                                    }
                                    done();
                                }, bail);
                        }
                    },
                    function CheckExistingEmail(done) {
                        if (errors.email) {
                            done();
                        } else {
                            clove.db.User.findOne({
                                    where: {
                                        email: user.email
                                    }
                                })
                                .then(function (u) {
                                    if (u) {
                                        errors.email = "Email already in use";
                                    }
                                    done();
                                }, bail);
                        }
                    }
                ], function () {
                    cb(null, clove.utils.equals(errors, {}) ? null : errors);
                });
            }
        }
    });



    return User;
};
