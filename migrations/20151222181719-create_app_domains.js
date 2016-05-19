'use strict';
var async = require('async');

module.exports = {
    up: function (migration, DataTypes, done) {
        async.series([
            function (next) {
                migration.createTable("tbl_appdomains", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: DataTypes.BIGINT
                    },
                    name: {
                        type: DataTypes.STRING
                    },
                    createdAt: {
                        allowNull: false,
                        type: DataTypes.DATE
                    },
                    updatedAt: {
                        allowNull: false,
                        type: DataTypes.DATE
                    }
                }).done(function () {
                    console.log(arguments);
                    next();
                });
            },
            function (next) {
                migration.createTable("tbl_userappdomains", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: DataTypes.BIGINT
                    },
                    userId: {
                        type: DataTypes.BIGINT,
                        references: {model: "tbl_users", key: "id"}
                    },
                    appDomainId: {
                        type: DataTypes.BIGINT,
                        references: {
                            model: "tbl_appdomains",
                            key: "id"
                        }
                    },
                    createdAt: {
                        allowNull: false,
                        type: DataTypes.DATE
                    },
                    updatedAt: {
                        allowNull: false,
                        type: DataTypes.DATE
                    }
                }).done(function () {
                    next();
                });
            },
            function (next) {
                migration.addColumn("tbl_users", "defaultAppDomainId", {
                    type: DataTypes.BIGINT,
                    references: {model: "tbl_users", key: "id"}
                }).done(function () {
                    next();
                });
            },
            function (next) {
                migration.createTable("tbl_claims", {
                    id: {
                        type: DataTypes.BIGINT,
                        autoIncrement: true,
                        unique: true,
                        allowNull: false,
                        primaryKey: true
                    },
                    name: {
                        type: DataTypes.STRING,
                        allowNull: false
                    },
                    description: {
                        type: DataTypes.STRING
                    },
                    createdAt: {
                        allowNull: false,
                        type: DataTypes.DATE
                    },
                    updatedAt: {
                        allowNull: false,
                        type: DataTypes.DATE
                    }
                }).done(function () {
                    next();
                });
            },
            function (next) {
                migration.createTable("tbl_userappdomainclaims", {
                    id: {
                        type: DataTypes.BIGINT,
                        autoIncrement: true,
                        unique: true,
                        allowNull: false,
                        primaryKey: true
                    },
                    claimId: {
                        type: DataTypes.BIGINT,
                        allowNull: false,
                        reference: {model: "tbl_userclaims", key: "id"}
                    },
                    userAppDomainId: {
                        type: DataTypes.BIGINT,
                        allowNull: false,
                        reference: {model: "tbl_userappdomains", key: "id"}
                    },
                    createdAt: {
                        allowNull: false,
                        type: DataTypes.DATE
                    },
                    updatedAt: {
                        allowNull: false,
                        type: DataTypes.DATE
                    }
                }).done(function () {
                    next();
                });
            }
        ], function () {
            done();
        });


    },

    down: function (migration, DataTypes, done) {
        return migration
            .dropTable("tbl_userappdomains")
            .dropTable("tbl_appdomains")
            .dropTable("tbl_claims")
            .done(done);
    }
};
