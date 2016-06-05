'use strict';
/* global process */
var fs = require('fs');

module.exports = function (extConfig) {
    let config = extConfig;
    if (!extConfig) {
        var env = process.env.NODE_ENV;
        if (!env) {
            env = "development";
        }
        config = require("../config/config.js")[env];

        try {
            var local = require("../config/local.js")[env];
        } catch(err) {
        // no local settings file located
        }

        if (local) Object.assign(config, local);
    }


    var core = {
        db: require("./models")(env, config),
        config: config,
        async: require("async"),
        controllers: {},
        middleware: {},
        env: env
    };

    core.config.endpoint_port = process.env.PORT || core.config.endpoint_port || 3000;

    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = core.config.ssl ? "0" : "1";

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    core.utils = require("./utils")(core.config.secret);

    return core;

};
