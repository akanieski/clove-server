/* global clove */
module.exports = function UserController(app) {
    var db = clove.db,
        async = require("async"),
        _ = require("lodash"),
        Controller = this;
        
    /*
        
    Controller.updateUser = function(req, res) {
        var bail = function (err, code) {
            clove.log(arguments);
            res.status(code || 500).send({
                error: err,
                success: false
            });
        };

        db.User.findById(req.params.userId).then(function (user) {
            if (!user) {
                bail("Could not find user " + req.params.userId, 404);
                return;
            }
            
        }).catch(bail);
    };    
        
    Controller.getUser = function(req, res) {
        var payload = {};
        var bail = function (err, code) {
            clove.log(arguments);
            res.status(code || 500).send({
                error: err,
                success: false
            });
        };
        
        async.series([
            function(next) {
                db.User.findById(req.params.userId).then(function (user) {
                    if (!user) {
                        bail("Could not find user " + req.params.userId, 404);
                        return;
                    }
                    
                    payload.data = user;
                    
                    next();
                    
                }).catch(bail);
            },
            function checkAccess(next) {
                // Check to see if session user is the same as the user being requested
                if (req.session.userId == req.params.userId) {
                    next();
                    return;
                }
                // Check to see if the session user is an app domain manager
            },
            function(next) {
                payload.user.isValid({}, function (err, fieldErrors) {
                    if (err) {
                        bail(err);
                    } else if (fieldErrors) {
                        payload.errors = fieldErrors;
                        bail("Errors found in user data", 420);
                    } else {
                        next();
                    }
                });
            }
        ], function(){
            payload.success = true;
            res.status(200).send(payload);
        });

        
    };
    

    db.Claim.cache().then(function (claims) {

        var DOMAIN_ADMINS_ONLY = {
            allowedClaims: [claims.DOMAIN_ADMINS]
        };
        var DOMAIN_USER = {
            allowedClaims: [claims.DOMAIN_USERS]
        };

        // General Endpoints
        app.get("/api/user/:id", clove.middleware.authorize(DOMAIN_USER, Controller.getClaim));
        
        app.put("/api/user/:id", clove.middleware.authorize(DOMAIN_USER, Controller.updateUser));
    });
    */
};