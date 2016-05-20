'use strict' 
class CloveService {
    constructor() { }
    
    setup(options) {
        global.clove = require("./app/core")(options);
        options = options || {};
        clove.log = options.logger || console.log;
        
        // Get initial express server setup
        var express = require("express");
        var app = express();
        var fs = require("fs");
        var path = require("path");
        var bodyParser = require("body-parser");
        var http = clove.config.ssl ? require("https") : require("http");
    
        return new Promise((resolve, reject) => {
            // Get claims cache
            clove.log('Claims loading ..')
            clove.db.Claim.cache().then(function (claims) {
                clove.log('Claims cached.')
                clove.middleware = require("./app/middleware");
                if (clove.config.ssl) {
                    clove._server = http.createServer({
                        key: fs.readFileSync(path.resolve(path.join(__dirname, clove.config.ssl.key))),
                        cert: fs.readFileSync(path.resolve(path.join(__dirname, clove.config.ssl.crt)))
                    }, app).listen(clove.config.endpoint_port, function () {
                        clove.log("Clove server listening on port %s using the '" + clove.env + "' environment (HTTPS).",
                            clove.config.endpoint_port);
                        resolve(app);
                    });
                } else {
                    clove._server = http.createServer(app).listen(clove.config.endpoint_port, function () {
                        clove.log("Clove server listening on port %s using the '" + clove.env + "' environment.",
                            clove.config.endpoint_port);
                        resolve(app);
                    });
                }
            }).catch(e => {
                clove.log(e)
                reject(e);
            });
        })
    }
}

module.exports = CloveService