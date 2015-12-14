/* global global */
/* global it */
/* global describe */
/* global clove */
var request = require("request");
var assert = require("assert");
global.clove = require("../app/core");
var host = "http://127.0.0.1:" + clove.config.endpoint_port;

describe("Token Authentication API", function () {
    describe("password reset process", function() {
        it("should generate a proper token", function(done) {
           request.post({
                url: host + "/api/reset_password",
                json: {
                    username: "administrator"
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 200, "login response status code must be 200");
                assert.equal(body.token !== "undefined" && body.token !== null, true);
                assert.equal(body.email.indexOf(body.token) > -1, true);
                done();
                
            });
       });
    });
    describe("authorization middleware", function () {
        it("should accept with a proper token", function (done) {
            request.post({
                url: host + "/api/auth",
                json: {
                    username: "administrator",
                    password: "administrator"
                }
            }, function (err, resp, body) {

                assert.equal(resp.statusCode, 200, "login response status code must be 200");
                assert.equal(body.token !== "undefined" && body.token !== null, true);
                
                request.get({
                    url: host + "/api/status",
                    headers: {
                        Authorization: "Bearer " + body.token
                    }
                }, function (err, resp, body) {
                    
                    assert.notEqual(resp.statusCode, 401, "routes should be accessible with proper token");
                    assert.equal(resp.statusCode, 200, "routes should be accessible with proper token");
                    
                    done();
                });

            });
        });
        it("should reject without a proper token", function (done) {
            request.get({
                url: host + "/api/status",
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 401, "login response to bad password must be 401");
                assert.equal(body.error !== "undefined", true);

                done();
            });
        });
    });
    describe("api/auth", function () {
        it("should provide a token with correct credentials", function (done) {
            request.post({
                url: host + "/api/auth",
                json: {
                    username: "administrator",
                    password: "administrator"
                }
            }, function (err, resp, body) {
                assert.equal(resp.statusCode, 200, "login response status code must be 200");
                assert.equal(body.token !== "undefined" && body.token !== null, true);
                done();
            });
        });
        it("should fail login with incorrect credentials", function (done) {
            request.post({
                url: host + "/api/auth",
                json: {
                    username: "administrator",
                    password: "badpassword"
                }
            }, function (err, resp, body) {
                assert.equal(resp.statusCode, 401, "login response to bad password must be 401");
                assert.equal(body.error && body.error !== "", true);
                done();
            });
        });
        it("should fail login when credentials are not active", function (done) {
            request.post({
                url: host + "/api/auth",
                json: {
                    username: "administrator2",
                    password: "administrator"
                }
            }, function (err, resp, body) {
                assert.equal(resp.statusCode, 401, "login response to bad password must be 401");
                assert.equal(body.error && body.error !== "", true);
                done();
            });
        });
    });
});
