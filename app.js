/* global global */
/* global process */
/* global clove */
var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");

global.clove = require("./app/core");
function CloveServer(options, completed) {
    options = options || {};
    clove.log = options.logger || console.log;
    
    var http = clove.config.ssl ? require("https") : require("http");

    app.use(bodyParser.json());

    // Bring in Controllers..
    var SystemController = require("./app/controllers/system_controller.js");
    var AuthController = require("./app/controllers/auth_controller.js");
    var ClaimsController = require("./app/controllers/claim_controller.js");
    var AppDomainController = require("./app/controllers/appdomain_controller.js");
    var UserController = require("./app/controllers/user_controller.js");


    clove.db.Claim.cache().then(function (claims) {
        clove.middleware = require("./app/middleware");
        clove.controllers.system = new SystemController(app);
        clove.controllers.auth = new AuthController(app);
        clove.controllers.appdomain = new AppDomainController(app);
        clove.controllers.claims = new ClaimsController(app);
        clove.controllers.user = new UserController(app);

        app.use(express.static("www"));

        if (clove.config.ssl) {
            clove._server = http.createServer({
                key: fs.readFileSync(path.resolve(clove.config.ssl.key)),
                cert: fs.readFileSync(path.resolve(clove.config.ssl.crt))
            }, app).listen(clove.config.endpoint_port, function () {
                clove.log("Clove server listening on port %s using the '" + clove.env + "' environment (HTTPS).",
                    clove.config.endpoint_port);
                if (completed) completed();
            });
        } else {
            clove._server = http.createServer(app).listen(clove.config.endpoint_port, function () {
                clove.log("Clove server listening on port %s using the '" + clove.env + "' environment.",
                    clove.config.endpoint_port);
                if (completed) completed();
            });
        }
    }).catch((err) => {throw err;});
    
};

if (!module.parent) {
    new CloveServer();
} else {
    module.exports = CloveServer;
}