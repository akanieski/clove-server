/* global clove */
/* global clove */
module.exports = function ClaimsController(app) {
    var db = clove.db,
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
    
    app.put("/api/claim/:id", clove.middleware.authorize({}, Controller.updateClaim));
    app.post("/api/claim", clove.middleware.authorize({}, Controller.createClaim));
    app.get("/api/claim/:id", clove.middleware.authorize({}, Controller.getClaim));
    app.get("/api/claims", clove.middleware.authorize({}, Controller.getClaims));
    app.get("/api/user/:userId/appdomain/:appDomainId/claims", clove.middleware.authorize({}, Controller.getClaimsByAppDomainAndUser));
    
};