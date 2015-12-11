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
    
    core.utils = require("./utils")(core.config.secret);

    return core;

}();