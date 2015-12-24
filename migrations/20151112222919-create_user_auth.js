"use strict";
module.exports = {
    up: function (migration, DataTypes, done) {
        migration.createTable("tbl_users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT
            },
            firstName: {
                type: DataTypes.STRING
            },
            lastName: {
                type: DataTypes.STRING
            },
            username: {
                type: DataTypes.STRING
            },
            password: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING
            },
            active: {
                type: DataTypes.BOOLEAN
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
            done();
        });
        
    },
    down: function (migration, DataTypes, done) {
        return migration.dropTable("tbl_users").done(done);
    }
};