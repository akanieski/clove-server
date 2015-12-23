/* global clove */
module.exports = function SystemController(app) {
    
    var Controller = this;

    
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        next();
    });

    app.get("/", function(req, res){
       res.send("OK"); 
    });

    app.get("/api/status", clove.middleware.authorize({}, function (req, res) {
        res.status(200).send({ status: "OK" });
    }));
    

    app.get("/api/status_unauth", function (req, res) {
        res.status(200).send({ status: "OK.. Wah wah" });  
    }); 
    
};