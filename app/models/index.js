"use strict";
/* global __dirname */
/* global process */
/* jshint node: true */
module.exports = function (env, config) {
    var fs = require("fs"),
        path = require("path"),
        Sequelize = require("sequelize"),
        basename = path.basename(module.filename),
        config = config || require(path.resolve("./config/config.js"))[env],
        sequelize,
        db = {};

    if (config.use_env_variable) {
        if (!process.env[config.use_env_variable]) {
            throw new Error("Environment variable (" + config.use_env_variable + ") has not been set");
        } else {
            sequelize = new Sequelize(process.env[config.use_env_variable]);
        }
    } else {
        sequelize = new Sequelize(config.database, config.username, config.password, config);
    }

    fs
        .readdirSync(__dirname)
        .filter(function (file) {
            return (file.indexOf(".") !== 0) && (file !== basename);
        })
        .forEach(function (file) {
            if (file.slice(-3) !== ".js") {
                return;
            }
            var model = sequelize["import"](path.join(__dirname, file));
            db[model.name] = model;
        });

    Object.keys(db).forEach(function (modelName) {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
};
