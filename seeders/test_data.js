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
                
                user.save().then(function(){
                    next();
                }).catch(function(err){
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
                }).save().then(function(){next();}).catch(function(e){
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
                clove.db.User.findOne({where: {username: "administrator"}}).then(function(user){
                    clove.db.AppDomain.create({
                        name: "Test App Domain"
                    }).then(function(appDomain){
                        appDomain.addUser(user).then(next);
                    });
                    
                });
            } else {
                next();
            }
        });
    },
    function() {
        console.log("[Done Loading Seed Data]");
    }
]);
