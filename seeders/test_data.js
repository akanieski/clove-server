global.clove = require("../app/core");

clove.async.series([
    function (next) {
        clove.db.User.findOne({where: {username: "administrator"}}).then(function(user) {
            if (!user) {
                clove.db.User.build({
                    username: "administrator",
                    password: clove.utils.encrypt("administrator"),
                    email: "andrew.legacy@gmail.com",
                    active: 1
                }).save(next);
            }  
        });
    },
    function (next) {
        clove.db.User.findOne({where: {username: "administrator2"}}).then(function(user) {  
            if (!user) {
                clove.db.User.build({
                    username: "administrator2",
                    password: clove.utils.encrypt("administrator"),
                    email: "andrew.legacy@gmail.com",
                    active: 0
                }).save(next);
            }  
        });
    },

]);
