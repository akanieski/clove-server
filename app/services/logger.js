"use strict";
/* jshint node: true */

var winston = require("winston"),
    path = require("path");

var transports = [];

if (clove.config.logging.console) {
    transports.push(new(winston.transports.Console)({
        name: "console"
    }));
}
if (clove.config.logging.info_path) {
    transports.push(new(winston.transports.File)({
        name: "info-file",
        filename: clove.config.logging.info_path,
        level: "info"
    }));
}
if (clove.config.logging.error_path) {
    transports.push(new(winston.transports.File)({
        name: "error-file",
        filename: clove.config.logging.error_path,
        level: "error"
    }));
}

var logger = new(winston.Logger)({
    transports: transports
});


module.exports = logger;
