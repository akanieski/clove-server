/* global clove */

/**
* Authorizes given controller action using the provided options
* 
* @options =
* {
*   // requires that the request contain a valid authorization token <default true>
*   authenticate: true,
* 
*   // lists all allowed roles (tbl_roles.id), options are pulled from the tbl_roles 
*   // table. default value is null/undefined which allows all roles
*   roles_allowed: [],
*   
* }
*/
module.exports = (function () {
    var jwt = require("jsonwebtoken");
    
    return function (options, action) {
        if (typeof options == "function") {
            action = options;
            options = {};
        }
        return function (request, response, next) {
            if (request.headers.authorization && 
                request.headers.authorization.indexOf("Bearer ") > -1 && 
                request.headers.authorization.split(" ")[1]) {
                var token = request.headers.authorization.split(" ")[1];
                var valid = false;
                var errMessage = "Token invalid";
                try {
                    valid = jwt.verify(token, clove.config.secret);
                } catch (err) {
                    if (err instanceof jwt.TokenExpiredError) {
                        valid = false;
                        errMessage = "Token has expired. Please try again.";
                    }
                }
                if (valid) {
                    request.session = jwt.decode(token);
                    action(request, response, next);
                } else {
                    response.status(401).send({ error: errMessage, success: false});
                }
                        
            } else {
                response.status(401).send({ error: "Token not authorized", body: request.body, success: false, url: request.url, headers: request.headers });    
            }
                
        };
    };
})();