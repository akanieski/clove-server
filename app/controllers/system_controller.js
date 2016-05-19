/* global clove */
module.exports = function SystemController(app) {

    var Controller = this;

    clove.log("[INIT] Registered CORS Handler");
    
    app.use(function corsHandler(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
        next();
    });

    app.get("/", function defaultRoute(req, res) {
        res.send("OK");
    });

    app.get("/api/status", clove.middleware.authorize({}, function apiStatus(req, res) {
        res.status(200).send({
            status: "OK"
        });
    }));


    app.get("/api/status_unauth", function apiStatus2(req, res) {
        res.status(200).send({
            status: "OK.. Wah wah"
        });
    });

};
