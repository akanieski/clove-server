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
    var _ = require("lodash");
    var async = require("async");

    return function _processJWT(options, action) {
        if (typeof options == "function") {
            action = options;
            options = {};
        }
        return function processJWT(request, response, nextHandler) {
            var bail = function (err, code) {
                response.status(code || 500).send({
                    error: err,
                    success: false
                });
            };

            if (request.headers.authorization &&
                request.headers.authorization.indexOf("Bearer ") > -1 &&
                request.headers.authorization.split(" ")[1]) {
                var token = request.headers.authorization.split(" ")[1];
                try {
                    if (!jwt.verify(token, clove.config.secret)) {
                        bail("Token invalid", 401);
                        return;
                    }
                } catch (err) {
                    if (err instanceof jwt.TokenExpiredError) {
                        bail("Token has expired. Please try again.", 401);
                        return;
                    }
                }
                var payload = jwt.decode(token);
                if (!payload) {
                    clove.log(request.headers.authorization);
                    bail("Token invalid", 400);
                    return;
                }

                var appDomainMatch = null;

                async.series([

                    function checkAppDomainAccess(next) {
                        if (!payload.sysadmin && (options.domainAccess || options.allowedClaims)) {
                            // App domain is required to determine if user has access to given app domain
                            var appDomainField = "appDomainId";
                            if (typeof options.domainAccess === "string") {
                                appDomainField = typeof options.domainAccess;
                            }
                            if (!request.params[appDomainField]) {
                                bail("App domain not specified", 401);
                                return;
                            }
                            request.params[appDomainField] = parseInt(request.params[appDomainField], 10);
                            appDomainMatch = _.findWhere(payload.userAppDomains, {
                                appDomainId: request.params[appDomainField]
                            });

                            if (!appDomainMatch) {
                                bail("User has no access to the app domain specified", 401);
                                return;
                            }
                        }
                        next();
                    },

                    function checkClaimsAccess(next) {
                        // Check claims to make sure user has access to resource endpoint
                        if (!payload.sysadmin && options.allowedClaims) {

                            if (_.filter(options.allowedClaims, function (claim) {
                                    return _.filter(appDomainMatch.claims, function (_claim) {
                                        return _claim.id == claim.id;
                                    });
                                }).length === 0) {
                                bail("User not authorized to access this endpoint for given app domain", 401);
                                return;
                            }

                        }
                        next();
                    }

                ], function () {
                    request.session = payload;
                    action(request, response, nextHandler);
                });

            } else {
                bail("Token not authorized", 401);
            }

        };
    };
})();
