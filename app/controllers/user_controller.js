/* global clove */
module.exports = function UserController(app) {
    var db = clove.db,
        async = require("async"),
        _ = require("lodash"),
        Controller = this;
        
    
    Controller.updateUser = function(req, res) {
        var payload = {};
        var bail = function (err, code) {
            clove.log(arguments);
            if (typeof err !== 'string') { payload.exception = err; }
            payload.error = err.toString();
            payload.success = false;
            res.status(code || 500).send(payload);
        };
        
        async.series([
            function findUserById(next) {
                db.User.findById(req.params.userId).then(function (user) {
                    if (!user) {
                        bail("Could not find user " + req.params.userId, 404);
                        return;
                    }
                    
                    payload.data = user;
                    
                    [   // The below fields are to be updated. Add fields here to allow them to be persisted by this endpoint
                        "firstName",
                        "lastName",
                        "email"
                    ].forEach(function(field){
                        payload.data[field] = req.body[field];
                    });
                    
                    if (req.body.password) {
                        payload.data.password = req.body.password;
                    }
                    
                    next();
                    
                }).catch(bail);
            },
            function checkAccess(next) {
                // Check to see if session user is the same as the user being requested
                if (req.session.userId == req.params.userId) {
                    next();
                    return;
                } else {
                    bail("Not authorized to update this user profile", 401);
                }
                // Check to see if the session user is an app domain manager
            },
            function validate(next) {
                payload.data.isValid({
                    skipPasswordCheck: !req.body.password,
                    confirmPassword: req.body.password,
                    confirmation: req.body.password2
                }, function (err, fieldErrors) {
                    if (err) {
                        bail(err);
                    } else if (fieldErrors) {
                        payload.errors = fieldErrors;
                        bail("Errors found in user data", 420);
                    } else {
                        next();
                    }
                });
            },
            function saveUser(next) {
                // if password has been changed then encrypt it
                if (req.body.password) {
                    payload.data.password = clove.utils.encrypt(payload.data.password);
                }
                payload.data.save()
                    .then(next)
                    .catch(bail);
            }
        ], function(){
            payload.data = payload.data.toBasicJSON();
            payload.success = true;
            res.status(200).send(payload);
        });

        
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
                next();
            }
        ], function(){
            payload.data = payload.data.toBasicJSON(); // strip out any sensitive info like password
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
        app.get("/api/appdomain/:appDomainId/user/:userId", clove.middleware.authorize(DOMAIN_USER, Controller.getUser));
        app.get("/api/user/:userId", clove.middleware.authorize(DOMAIN_USER, Controller.getUser));
        
        app.put("/api/user/:userId", clove.middleware.authorize({}, Controller.updateUser));
    });
};