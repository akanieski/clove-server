"use strict";
/* jshint node: true */
module.exports = function(env) {
    var fs = require("fs"), 
        path = require("path"), 
        Sequelize = require("sequelize"), 
        basename = path.basename(module.filename), 
        config = require(path.resolve("./config/db.json"))[env], 
        sequelize, 
        db = {};
    
    if (process.env.DATABASE_URL) {
        sequelize = new Sequelize(process.env.DATABASE_URL);
    } else {
        sequelize = new Sequelize(config.database, config.username, config.password, config);
    }
    
    fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== basename);
    })
    .forEach(function (file) {
        if (file.slice(-3) !== ".js") { return; }
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