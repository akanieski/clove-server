/* global global */
/* global process */
/* global clove */
var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");

global.clove = require("./app/core");

var http = clove.config.ssl ? require("https") : require("http");

app.use(bodyParser.json());

clove.middleware = require("./app/middleware");
clove.controllers.system = require("./app/controllers/system_controller.js")(app);
clove.controllers.auth = require("./app/controllers/auth_controller")(app);

app.use(express.static("www"));

// For Ad-Hoc execution
if (!module.parent) {
    if (clove.config.ssl) {
        clove._server = http.createServer({
            key: fs.readFileSync(path.resolve(clove.config.ssl.key)),
            cert: fs.readFileSync(path.resolve(clove.config.ssl.crt))
        }, app).listen(clove.config.endpoint_port, function() {
            console.log("Clove server listening on port %s using the '" + clove.env + "' environment.", clove.config.endpoint_port);
        });
    } else {
        clove._server = http.createServer(app).listen(clove.config.endpoint_port, function() {
            console.log("Clove server listening on port %s using the '" + clove.env + "' environment.", clove.config.endpoint_port);
        });
    }
} else {
    // For module export execution
    console.log("Clove app module established");
    module.exports = app;
}
