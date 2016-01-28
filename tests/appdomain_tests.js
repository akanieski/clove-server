/* global global */
/* global it */
/* global describe */
/* global clove */
var request = require("request");
var assert = require("assert");
var jwt = require("jsonwebtoken");
global.clove = require("../app/core");

var host = process.env.testing_host || ((clove.config.ssl ? "https" : "http") + "://127.0.0.1:" + clove.config.endpoint_port);

function GetToken(username, password, next) {
    request.post({
        url: host + "/api/auth",
        json: {
            username: username,
            password: password
        }
    }, function (err, resp, body) {
        assert.equal(err, null);
        next(body.token);
    });
}

describe("App Domain API", function () {

    it("should list app domains by user", function (done) {
        GetToken("administrator", "administrator", function (token) {
            request.get({
                url: host + "/api/user/1/appdomains",
                json: {},
                headers: {
                    Authorization: "Bearer " + token
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 200, "app domains by user response status code must be 200");
                assert.equal(body.data !== "undefined" && body.data !== null && body.data.length > 0, true, "response should contain list of app domains");

                done();
            });
        });
    });

    it("should get specified app domain from user", function (done) {
        GetToken("administrator", "administrator", function (token) {
            request.get({
                url: host + "/api/appdomain/1/user/1",
                json: {},
                headers: {
                    Authorization: "Bearer " + token
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 200, "specific app domain by user response status code must be 200");
                assert.equal(body.data !== "undefined" && body.data !== null && body.data.length > 0, true, "response should contain specified app domain");

                done();
            });
        });
    });

    it("should get existing app domain", function (done) {
        GetToken("administrator", "administrator", function (token) {
            request.get({
                url: host + "/api/appdomain/1",
                json: {},
                headers: {
                    Authorization: "Bearer " + token
                }
            }, function (err, resp, body) {

                assert.equal(resp.statusCode, 200, "existing app domain response status code must be 200");
                assert.equal(body.data !== "undefined" && body.data !== null && body.data.id > 0, true, "response should contain new app domain");

                done();
            });
        });
    });

    it("should not post new app domain if not authorized", function (done) {
        request.post({
            url: host + "/api/appdomain",
            json: {
                name: "Test App Domain",
            }
        }, function (err, resp, body) {
            assert.equal(resp.statusCode, 401, "posting new app domain should respond with 401 when no jwt provided");
            assert.equal(body.success, false);
            done();
        });
    });

    it("should add app domain to user", function (done) {
        GetToken("administrator", "administrator", function (token) {
            request.post({
                url: host + "/api/appdomain/1/user/2",
                json: {},
                headers: {
                    Authorization: "Bearer " + token
                }
            }, function (err, resp, body) {

                assert.equal(resp.statusCode, 200, "add app domain response status code must be 401");
                assert.equal(body.success, true, "response should be successful");

                done();
            });
        });
    });

    it("should not add app domain to user if not authorized", function (done) {
        GetToken("basicuser", "basicuser", function (token) {
            request.post({
                url: host + "/api/appdomain/1/user/4",
                json: {},
                headers: {
                    Authorization: "Bearer " + token
                }
            }, function (err, resp, body) {

                assert.equal(resp.statusCode, 401, "add app domain response status code must be 401");
                assert.equal(body.success, false, "response should be successful");

                done();
            });
        });
    });

    it("should post new app domain", function (done) {
        GetToken("administrator", "administrator", function (token) {
            request.post({
                url: host + "/api/appdomain",
                json: {
                    name: "Test App Domain 2",
                },
                headers: {
                    Authorization: "Bearer " + token
                }
            }, function (err, resp, body) {

                assert.equal(resp.statusCode, 200, "new app domain response status code must be 200");
                assert.equal(body.data !== "undefined" && body.data !== null && body.data.id > 0, true, "response should contain new app domain");
                assert.equal(body.data.userId > 0, true, "new app domain should be created under the current user");

                done();
            });
        });
    });

    it("should return a proper token when selecting an app domain", function (done) {
        GetToken("administrator", "administrator", function (token) {
            request.post({
                url: host + "/api/appdomain/1/user/1/selectAppDomain",
                json: {},
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 200, "app domain selection token response status code must be 200");
                assert.notEqual(body.token, false, "response should contain a proper app domain token");
                assert.notEqual(jwt.verify(body.token, clove.config.secret), false, "response should contain a proper app domain token");
                
                done();
            });
        });
    });

});
