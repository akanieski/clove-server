/* global process */
module.exports = function () {
    var env = process.env.NODE_ENV;
    if (!env) { 
        env = "development"; 
    }
    var config = require("../config/config.json")[env];
    
    var core =  {
        db: require("./models")(env),
        config: config,
        async: require("async"),
        controllers: {},
        middleware: {},
        env: env
    };
    
    core.config.endpoint_port = process.env.PORT || core.config.endpoint_port || 3000;
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = core.config.ssl ? "0" : "1";
    
    core.utils = require("./utils")(core.config.secret);

    return core;

}();