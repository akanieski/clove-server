/* global clove */
/* global clove */
module.exports = function ClaimsController(app) {
    var db = clove.db,
        async = require('async'),
        Controller = this;
    
    Controller.getClaim = function getClaim(req, res, next) {
        
        var bail = function(err, code) {
            res.status(code || 500).send({error: err, success: false});
        };
        if (!req.params.id) {
            bail("Must specify specific claim id.", 400);
            return;
        }
        db.Claim.findById(req.params.id)
            .then(function(claim){
                if (!claim) {
                    bail("Could not locate claim " + req.params.id, 404);
                    return;
                }
                res.status(200).send({data: claim, success: true});
            })
            .catch(bail);
    };
    
    Controller.getClaims = function getClaims(req, res, next) {
        
        var bail = function(err, code) {
            res.status(code || 500).send({error: err, success: false});
        };
        
        db.Claim.findAll(req.params.id)
            .then(function(claims){
                res.status(200).send({data: claims, success: true});
            })
            .catch(bail);
    };
    
    Controller.updateClaim = function updateClaim(req, res, next) {
        
        var bail = function(err, code) {
            res.status(code || 500).send({error: err, success: false});
        };
        if (!req.params.id) {
            bail("Must specify specific claim id.", 400);
            return;
        }
        db.Claim.findById(req.params.id)
            .then(function(claim){
                if (!claim) {
                    bail("Could not locate claim " + req.params.id, 404);
                    return;
                }
                claim
                    .update(req.body)
                    .then(function(claim){
                        res.status(200).send({data: claim, success: true});
                    });
            })
            .catch(bail);
    };
    
    Controller.createClaim = function updateClaim(req, res, next) {
        
        var bail = function(err, code) {
            res.status(code || 500).send({error: err, success: false});
        };
        
        if (!req.body.name) {
            res.status(400).send({errors: {name: "Name is required"}, success: false});
            return;
        }
        
        db.Claim.create(req.body)
            .then(function(claim){
                if (!claim) {
                    bail("Could not locate claim " + req.params.id, 404);
                    return;
                }
                claim
                    .update(req.body)
                    .then(function(claim){
                        res.status(200).send({data: claim, success: true});
                    });
            })
            .catch(bail);
    };
    
    Controller.getClaimsByAppDomainAndUser = function getClaimsByAppDomainAndUser(req ,res, next) {
        var bail = function(err, code) {
            console.log(arguments);
            res.status(code || 500).send({error: err, success: false});
        };
        
        db.User.findById(req.params.userId).then(function(user){
            if (!user) {
                bail("Could not find user " + req.params.userId, 404);
                return;
            }
            db.UserAppDomain.findOne({include: {as: "claims", model: db.Claim}, where: {userId: req.params.userId, appDomainId: req.params.appDomainId} })
                .then(function(userAppDomain){
                    if (!userAppDomain) {
                        bail("Specified app domain not found for given user", 404);
                        return;
                    }
                    
                    res.status(200).send({data: userAppDomain.claims, success: true});     
                    
                }).catch(bail);
        }).catch(bail);
        
    };
    
    Controller.addClaimToAppDomainAndUser = function addClaimToAppDomainAndUser(req ,res, next) {
        var bail = function(err, code) {
            if (typeof err != 'string') err = err.toString();
            res.status(code || 500).send({error: err, success: false});
        };
        
        // Make database checks in parallel for performance advantages
        async.parallel({
            // Check to make sure user exists
            checkUserExists: function checkUserExists(next) {
                db.User.findById(req.params.userId).then(function(user){
                    if (!user) {
                        bail("Could not find user specified", 404);
                        next(null, false);
                    } else {
                        next(null, user);
                    }
                }).catch(function(err){bail(err, 500);});
            },
            
            // Check to make sure claim exists
            checkClaimExists: function checkClaimExists(next) {
                db.Claim.findById(req.params.claimId).then(function(claim){
                    if (!claim) {
                        bail("Could not find claim specified", 404);
                        next(null, false);
                    } else {
                        next(null, claim);
                    }
                }).catch(function(err){bail(err, 500);});
            },
            
            // Check to make sure app domain exists
            checkUserAppDomainExists: function checkUserAppDomainExists(next) {
                db.UserAppDomain.findById(req.params.userAppDomainId).then(function(userAppDomain){
                    if (!userAppDomain) {
                        bail("Could not find app domain specified for given user", 404);
                        next(null, false);
                    } else {
                        next(null, userAppDomain);
                    }
                }).catch(function(err){bail(err, 500);});
            },
            
        }, function(err, results){
            if (results.checkUserExists && results.checkClaimExists && results.checkUserAppDomainExists) {
                db.UserAppDomainClaim.create({
                    userAppDomainId: results.checkUserAppDomainExists.id,
                    claimId: results.checkClaimExists.id
                }).then(function(){
                    res.status(200).send({success:true});
                }).catch(function(err){bail(err, 500);});
            }
        });
        
    };
    
    Controller.removeClaimFromUserAppDomain = function removeClaimFromUserAppDomain(req, res, next) {
        
        var bail = function(err, code) {
            res.status(code || 500).send({error: err, success: false});
        };
        
        db.UserAppDomainClaim.findById(req.params.claimId).then(function(claim){
            if (!claim) {
                bail("Could not locate specified claim for the given user app domain", 404);
            } else {
                claim.destroy().then(function(){
                    res.status(200).send({success: true});
                }).catch(function(err){bail(err, 500);});
            }
        });
                
                
    };
    
    app.get("/api/claim/:id", clove.middleware.authorize({}, Controller.getClaim));
    app.get("/api/claims", clove.middleware.authorize({}, Controller.getClaims));
    app.get("/api/user/:userId/appdomain/:appDomainId/claims", clove.middleware.authorize({}, Controller.getClaimsByAppDomainAndUser));
    app.put("/api/claim/:id", clove.middleware.authorize({}, Controller.updateClaim));
    app.post("/api/claim", clove.middleware.authorize({}, Controller.createClaim));
    app.post("/api/user/:userId/appdomain/:userAppDomainId/claim/:claimId", clove.middleware.authorize({}, Controller.addClaimToAppDomainAndUser));
    app.delete("/api/user/:userId/appdomain/:userAppDomainId/claim/:claimId", clove.middleware.authorize({}, Controller.removeClaimFromUserAppDomain));
    
};