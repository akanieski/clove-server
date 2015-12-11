var express = require("express");
var app = express();
var http = require("http").Server(app);
var bodyParser = require("body-parser");

global.clove = require("./app/core");
app.use(bodyParser.json());

clove.middleware = require("./app/middleware");
clove.controllers.system = require("./app/controllers/system_controller.js")(app);
clove.controllers.auth = require("./app/controllers/auth_controller")(app);

app.use(express.static("www"));

// For Ad-Hoc execution
if (!module.parent) {
    var server = http.listen(process.env.PORT || clove.config.port || 3000, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log("Clove server listening on port %s", port);
    });
} else {
    // For module export execution
    console.log("Clove app module established");
    module.exports = app;
}
