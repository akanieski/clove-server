/* global . */
/* global clove */
/* global clove */
module.exports = function AuthController(app) {

    var Controller = this,
        jwt = require("jsonwebtoken"),
        path = require("path"),
        EmailService = require("../services/email");

    var db = clove.db;




    /**
     * Authenticates provided username and password against database and initiates a new token
     * @response = 
     * OK 200
     * {
     *   token: '<token_here>',
     *   expiration:  <date>
     * }
     * 
     * NOT AUTHORIZED 401
     * {
     *   error: 'Username and/or password is not valid'
     * }
     */
    Controller.authenticate = function authenticate(request, response, next) {

        var q = db.User.findOne({
            where: {
                active: true,
                $or: [{email: request.body.email}, {username: request.body.username}],
                password: clove.utils.encrypt(request.body.password)
            },
            include: [{
                model: db.UserAppDomain,
                as: "userAppDomains",
                include: [{
                    model: db.AppDomain,
                    as: "appDomain"
                }, {
                    model: db.Claim,
                    as: "claims"
                }]
            }]
        });

        q.then(function (user) {
            if (user) {
                var token = jwt.sign({
                    userId: user.id,
                    sysadmin: user.sysadmin,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    userAppDomains: user.userAppDomains,
                }, clove.config.secret, {
                    issuer: require("os").hostname()
                });
                response.status(200).send({
                    token: token
                });
            } else {
                response.status(401).send({
                    error: "Username and/or password is not valid"
                });
            }

        }).catch(function (err) {
            clove.log(err.stack);
            response.status(500).send({
                error: "Server error.",
                detail: err
            });
        });

    };

    /**
     * Creates a new user profile 
     **/
    Controller.sign_up = function signUp(request, response) {
        var bail = function (err) {
            response.status(500).send({
                error: err,
                success: false
            });
        };
        
        var user = clove.db.User.build(request.body);

        clove.async.series([
            function (next) {
                user.isValid({
                    confirmPassword: true,
                    confirmation: request.body.password2
                }, function (err, fieldErrors) {
                    if (err) {
                        bail(err);
                    } else if (fieldErrors) {
                        response.status(420).send({
                            success: false,
                            data: request.body,
                            errors: fieldErrors
                        });
                    } else {
                        next();
                    }
                });
            },
            function (next) {
                user.password = clove.utils.encrypt(user.password);
                user.save().then(function () {
                    next();
                }).catch(function (err) {
                    bail(err);
                });
            },
            function (next) {
                delete user.password;
                response.send({
                    data: user,
                    success: true
                });
            }
        ]);
    };

    /**
     * Updates user profile's password for the given JWT 
     **/
    Controller.finish_reset_password = function finishResetPassword(request, response) {
        var payload;

        // Verify the token is correct
        try {
            jwt.verify(request.body.token, clove.config.secret);
            payload = jwt.decode(request.body.token);
        } catch (err) {
            response.status(420).send({
                error: "Password reset token invalid"
            });
            return;
        }

        if (request.body.password != request.body.password2) {
            response.status(420).send({
                error: "Password must match confirmation password"
            });
            return;
        }

        var strength = clove.utils.check_password(request.body.password);

        if (!strength) {
            response.status(420).send({
                error: strength
            });
            return;
        }

        var dbError = function (err) {
            // Add logging here since this should not really be happening in production
            response.status(420).send({
                error: "Could not locate provided user account"
            });
        };

        clove.db.User.findById(payload.userId)
            .then(function (user) {
                if (user) {
                    user.password = clove.utils.encrypt(request.body.password);
                    user.save().then(function () {
                        response.send({
                            success: true,
                            message: "Password has been reset"
                        });
                    }, dbError);
                } else {
                    dbError({
                        error: "User attempted to reset the password on an account that could not be located"
                    });
                }
            }, dbError);
    };

    /**
     * Creates a password reset token (JWT) that is emailed to the user for password reset
     **/
    Controller.start_reset_password = function startResetPassword(request, response, next) {

        if (!request.body.username) {
            response.status(420).send({
                error: "Username or Email is required"
            });
            return;
        }

        clove.db.User.findOne({
                where: {
                    $or: [{
                        username: request.body.username
                    }, {
                        email: request.body.username
                    }]
                }
            })
            .then(function (user) {
                if (user) {
                    var service = new EmailService();
                    var token = jwt.sign({
                        username: user.username,
                        email: user.email,
                        userId: user.id
                    }, clove.config.secret, {
                        expiresIn: "1h",
                        subject: "password_reset"
                    });

                    var url = clove.config.password_reset_url + "?token=" + token;

                    service.on("sent", function (err, msg) {

                        response.status(200).send({
                            success: true,
                            token: (clove.config.allow_tests ? token : null),
                            email: (clove.config.allow_tests && msg ? err || msg : null)
                        });

                    });

                    service.send({
                        from: clove.config.smtp.system.user,
                        to: user.email,
                        subject: "Password Reset Requested",
                        config: clove.config.smtp.system,
                        view: path.resolve("./app/templates/email_password_reset.ejs"),
                        data: {
                            reset_url: url
                        }
                    });

                } else {
                    response.status(200).send({
                        success: true
                    });
                }
            });

    };

    // Install Routes
    app.post("/api/auth", Controller.authenticate);
    app.post("/api/user", Controller.sign_up);
    app.post("/api/reset_password", Controller.start_reset_password);
    app.put("/api/reset_password", Controller.finish_reset_password);

};
