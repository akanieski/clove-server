/* global global */
/* global clove */
global.clove = require("../app/core");
console.log("Loading seed data ...");
clove.async.series([
    function (next) {
        clove.db.User.findOne({where: {username: "administrator"}}).then(function(user) {
            
            if (!user) {
                console.log("Creating primary user seeds");
                user = clove.db.User.build({
                    username: "administrator",
                    password: clove.utils.encrypt("administrator"),
                    email: "andrew.legacy@gmail.com",
                    active: 1
                });
                
                user.save().then(function() {
                    next();
                }).catch(function(err) {
                    console.log(err);
                    next();
                });
            } else {
                next();
            }
        });
    },
    function (next) {
        
        clove.db.User.findOne({where: {username: "administrator2"}}).then(function(user) {  
            if (!user) {
                console.log("Creating secondary user seeds");
                clove.db.User.build({
                    username: "administrator2",
                    password: clove.utils.encrypt("administrator"),
                    email: "andrew.legacy@gmail.com",
                    active: 0
                }).save().then(function() {next();}).catch(function(e) {
                    console.log(e);
                    next();
                });
            } else {
                next();
            }
        });
    },
    function (next) {
        
        clove.db.User.findOne({where: {username: "basicuser"}}).then(function(user) {  
            if (!user) {
                console.log("Creating basic user seeds");
                clove.db.User.build({
                    username: "basicuser",
                    password: clove.utils.encrypt("basicuser"),
                    email: "andrew.legacy@gmail.com",
                    active: 1
                }).save().then(function() {next();}).catch(function(e) {
                    console.log(e);
                    next();
                });
            } else {
                next();
            }
        });
    },
    function (next) {
        
        clove.db.User.findOne({where: {username: "basicuser2"}}).then(function(user) {  
            if (!user) {
                console.log("Creating 2nd basic user seeds");
                clove.db.User.build({
                    username: "basicuser2",
                    password: clove.utils.encrypt("basicuser2"),
                    email: "andrew.legacy@gmail.com",
                    active: 1
                }).save().then(function() {next();}).catch(function(e) {
                    console.log(e);
                    next();
                });
            } else {
                next();
            }
        });
    },
    function (next) {
        
        clove.db.AppDomain.findOne({where: {name: "Test App Domain"}}).then(function(appDomain) {
            if (!appDomain) {
                console.log("Creating AppDomain seeds");
                clove.db.User.findOne({where: {username: "administrator"}}).then(function(user) {
                    clove.db.AppDomain.create({
                        name: "Test App Domain"
                    }).then(function(appDomain) {
                        appDomain.addUser(user).then(function() {
                            next();
                        });
                    });
                    
                });
            } else {
                next();
            }
        });
    },
    function (next) {
        
        clove.db.AppDomain.findOne({where: {name: "Test App Domain"}}).then(function(appDomain) {
            if (!appDomain) {
                console.log("Creating 2nd AppDomain seeds");
                clove.db.User.findOne({where: {username: "basicuser"}}).then(function(user) {
                    clove.db.AppDomain.findById(1).then(function(appDomain) {
                        appDomain.addUser(user).then(function() {
                            next();
                        });
                    });
                    
                });
            } else {
                next();
            }
        });
    },
    function(next) {
        clove.db.AppDomain.findOrCreate({where: {
            name: "East London Company", 
        }}).then(function() {
            next();
        });
    },
    function(next) {
        clove.db.AppDomain.findOrCreate({where: {
            name: "West London Company", 
        }}).then(function() {
            next();
        });
    },
    function (next) {
        console.log("Creating claim seeds");
        clove.db.Claim.findOrCreate({where: {
            name: "Domain Administrator", 
            description: "Complete access to all elements of the domain"
        }}).then(function() {
            next();
        });
        
    },
    function (next) {
        
        clove.db.Claim.findOrCreate({where: {
            name: "Domain Manager", 
            description: "Management access to all elements of the domain"
        }}).then(function() {
            next();
        });
        
    },
    function (next) {
        
        clove.db.Claim.findOrCreate({where: {
            name: "Domain User", 
            description: "Basic access to all elements of the domain"
        }}).then(function() {
            next();
        });
        
    },
    function (next) {
        
        clove.db.UserAppDomainClaim.findOrCreate({where: {
            userAppDomainId: 1, 
            claimId: 1
        }}).then(function() {
            next();
        });
        
    },
    function (next) {
        
        clove.db.UserAppDomainClaim.findOrCreate({where: {
            userAppDomainId: 2, 
            claimId: 3
        }}).then(function() {
            next();
        });
        
    },
    function() {
        console.log("[Done Loading Seed Data]");
    }
]);
