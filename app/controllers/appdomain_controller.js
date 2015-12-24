/* global clove */
/* global clove */
module.exports = function AppDomainController(app) {
    var db = clove.db,
        Controller = this;
    
    Controller.createAppDomain = function createAppDomain(req, res, next) {
        var bail = function(err, code) {
            res.status(code || 500).send({error: err, success: false});
        };
        
        db.User.findById(req.session.userId).then(function(user){
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
                            as: 'appDomain'
                        }
                    ]
                })
                    .then(function(appDomain){
                        appDomain.setUser(user).then(function(){
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
        };
        var query = {appDomainId: req.params.id};
        // if jwt claims allow it ... then return the app domain regardles of whether the user
        // owns it.
        if (req.session.claims.indexOf('sysadmin') > -1) {
            query.userId = req.session.userId;
        }
        db.UserAppDomain.findOne({
            where: query, 
            include: [{
                model: db.AppDomain,
                as: 'appDomain'
            }]
        })
            .then(function(userAppDomain){
                if (userAppDomain) {
                    res.status(200).send({data: userAppDomain.appDomain, success: true});  
                } else {
                    bail("Not authorized", 401);
                }
            })
    };
    
    
    
    
    
    app.post("/api/appdomain", clove.middleware.authorize({}, Controller.createAppDomain));
    app.get("/api/appdomain/:id", clove.middleware.authorize({}, Controller.getAppDomain));
    
};