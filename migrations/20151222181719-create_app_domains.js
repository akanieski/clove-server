'use strict';
var async = require('async');

module.exports = {
    up: function (migration, DataTypes, done) {
        async.series([
            function(next){
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
            function(next){
                migration.createTable("tbl_userappdomains", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: DataTypes.BIGINT
                    },
                    user_id: {
                        type: DataTypes.BIGINT,
                        references: "tbl_users",
                        referenceKey: "id"
                    },
                    appdomain_id: {
                        type: DataTypes.BIGINT,
                        references: "tbl_appdomains",
                        referenceKey: "id"
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
        ], function(){
            done();
        });
        
        
  },

    down: function (migration, DataTypes, done) {
        return migration
            .dropTable("tbl_userappdomains")
            .dropTable("tbl_appdomains")
            .done(done);
  }
};
