/* global clove */
/* global clove */
module.exports = function AppDomainController(app) {
    var db = clove.db,
        async = require("async"),
        Controller = this;
    
    Controller.getAppDomainsByUser = function getAppDomainsByUser(req ,res, next) {
        var bail = function(err, code) {
            console.log(arguments);
            res.status(code || 500).send({error: err, success: false});
        };
        
        db.User.findById(req.params.userId).then(function(user) {
            if (!user) {
                bail("Could not find user " + req.params.userId, 404);
                return;
            }
            db.AppDomain.findAll({include: [{as: "userAppDomains", model: db.UserAppDomain, where: {userId: req.params.userId}}]})
                .then(function(appDomains) {
                    res.status(200).send({data: appDomains, success: true}); 
                }).catch(bail);
        }).catch(bail);
        
    };
    
    Controller.getAppDomainByUser = function getAppDomainByUser(req ,res, next) {
        var bail = function(err, code) {
            console.log(arguments);
            res.status(code || 500).send({error: err, success: false});
        };
        
        db.User.findById(req.params.userId).then(function(user) {
            if (!user) {
                bail("Could not find user " + req.params.userId, 404);
                return;
            }
            db.AppDomain.findAll({include: [{as: "userAppDomains", model: db.UserAppDomain, where: {userId: req.params.userId, appDomainId: req.params.appDomainId}}]})
                .then(function(appDomain) {
                    if (!appDomain) {
                        bail("Specified app domain not found for given user", 404);
                        return;
                    }
                    res.status(200).send({data: appDomain, success: true}); 
                }).catch(bail);
        }).catch(bail);
        
    };
    
    Controller.createAppDomain = function createAppDomain(req, res, next) {
        var bail = function(err, code) {
            res.status(code || 500).send({error: err, success: false});
        };
        
        db.User.findById(parseInt(req.session.userId, 10)).then(function(user) {
            if (user) {
                if (!user.active) {
                    bail("User account is not active", 401);
                    return;
                }
                
                db.UserAppDomain.create({
                    appDomain: {
                        name: req.body.name,
                    }
                }, {
                    include: [
                        {
                            model: db.AppDomain,
                            as: "appDomain"
                        }
                    ]
                })
                    .then(function(appDomain) {
                        appDomain.setUser(user).then(function() {
                            res.status(200).send({success: true, data: appDomain});
                        });
                    })
                    .catch(bail);
                    
            } else {
                bail("Could not locate current user profile", 400);
            }
        }).catch(bail);
    };
    
    
    Controller.getAppDomain = function getAppDomain(req, res, next) {
        var bail = function(err, code) {
                res.status(code || 500).send({error: err, success: false});
            },
            query = {appDomainId: req.params.id};
        
        // if jwt claims allow it ... then return the app domain regardles of whether the user
        // owns it.
        if (req.session.sysadmin) {
            query.userId = req.session.userId;
        }
        db.UserAppDomain.findOne({
            where: query, 
            include: [{
                model: db.AppDomain,
                as: "appDomain"
            }]
        })
            .then(function(userAppDomain) {
                if (userAppDomain) {
                    res.status(200).send({data: userAppDomain.appDomain, success: true});  
                } else {
                    bail("Not authorized", 401);
                }
            }).catch(function(err){bail(err.toString(), 500);});
    };
    
    
    Controller.addUserToAppDomain = function(req, res, next) {
        var bail = function(err, code) {
            res.status(code || 500).send({error: err, success: false});
        };
        
        var appDomain, user;
        async.series([
            function(next) {
                db.User.findById(parseInt(req.params.userId,10)).then(function(_user) {
                    user = _user;
                    if (!user) {
                        bail("Could not find specified user", 404);
                    } else {
                        next();
                    }
                });
            },
            function(next) {
                db.AppDomain.findById(req.params.appDomainId).then(function(_appDomain) {
                    appDomain = _appDomain;
                    if (!_appDomain) {
                        bail("Could not find specified app domain", 404);
                    } else {
                        next();
                    }
                });
            }
        ], function() {
            if (user && appDomain) {
                db.UserAppDomain.create({
                    userId: user.id,
                    appDomainId: appDomain.id
                }).then(function() {
                    res.status(200).send({success: true});
                });
            }
        });
    };
    
    db.Claim.cache().then(function(claims){
        
        app.post("/api/appdomain", clove.middleware.authorize({}, Controller.createAppDomain));
        app.get("/api/appdomain/:id", clove.middleware.authorize({}, Controller.getAppDomain));
        app.get("/api/user/:userId/appdomains", clove.middleware.authorize({}, Controller.getAppDomainsByUser));
        app.get("/api/user/:userId/appdomain/:appDomainId", clove.middleware.authorize({}, Controller.getAppDomainByUser));
        
        app.post("/api/appdomain/:appDomainId/user/:userId", clove.middleware.authorize({
            allowedClaims: [claims.DOMAIN_ADMINS]
        }, Controller.addUserToAppDomain));
        
    });
    
};