/* global clove */
/* jshint node: true */
"use strict";

var util = require("util"), 
    EventEmitter = require("events"), 
    service = {}, 
    email = require("emailjs"), 
    path = require("path"), 
    ejs = require("ejs"), 
    fs = require("fs");

var EmailService = function EmailService() {
    var service = this;
    
    service.templates = {};
    
    service.render = function(view, data, cb) {
        fs.exists(path.resolve(view), function(exists) {
            if (!exists) {
                service.emit("error", new Error ("Cannot locate view " + view));
            } else {
                fs.readFile(path.resolve(view), function(err, content) {
                    if (err) { 
                        var e = new Error(String.Format("Cannot process view of type {0} due to error {1}",  
                                          view.split(".").pop(), err.message));
                        service.emit("error", e);
                        if (cb) {
                            cb(e, content);
                        }
                    } else {
                        switch (view.split(".").pop()) {
                            
                        // HTML is just plain passthrough
                            case "html": 
                                service.emit("rendered", null, content);
                                if (cb) {
                                    cb(null, content);
                                }
                            break;
                            
                            // EJS must be rendered
                            case "ejs": 
                                content = ejs.render(content.toString(), data, {filename: "./app/templates/ejs.tmp"});
                                service.emit("rendered", null, content);
                                if (cb) {
                                    cb(null, content);
                                }
                            break;
                            
                            // Add additional rendering engines here
                            
                            default: 
                                var error = new Error("Cannot process view of type " + view.split(".").pop());
                                service.emit("error", error);
                            break;
                        }
                    }
                });
            }
        });
    };
    
    service.send = function(options, cb) {
        var content = "";
        
        if (!options) {
            var e = new Error("Email options are required");
            service.emit("error", e);
            if (cb) {
                cb(e);
            }
            return;
        }
        if (!options.config && !clove.config.email) {
            var error = new Error("Email configuration required");
            service.emit("error", error);
            if (cb) { 
                cb(error);
            }
            return;
        }
        
        clove.async.series([
            function(next) {
                service.render(options.view, options.data, function(err, rendered) {
                    if (err) {
                        service.emit("error", err);
                        if (cb) { 
                            cb(err);
                        }
                    } else {
                        content = rendered;
                        next();
                    }
                });
            },
            function(next) {
                switch (options.config.type) {
                    case "test":
                        service.emit("sent", null, content);
                        if (cb) {
                            cb(null, content);
                        }
                    break;
                    case "smtp":
                        var server = email.server.connect(options.config);
                                    
                        options.attachment = options.attachment || [];
                        options.attachment.push({
                            data: content,
                            alternative: true
                        });
                        server.send(options, function(err, msg) {
                            if (err) {
                                service.emit("error", err);
                                return;
                            }
                            service.emit("sent", err, msg && 
                                                      msg.alternative && 
                                                      msg.alternative.data ? msg.alternative.data : content);
                            if (cb) {
                                cb(err, msg && 
                                        msg.alternative && 
                                        msg.alternative.data ? msg.alternative.data : content);
                            }
                        });
                    
                    break;
                }        
            }
        ]);
        
    };
    
    EventEmitter.call(service);
};

util.inherits(EmailService, EventEmitter);

module.exports = EmailService;
