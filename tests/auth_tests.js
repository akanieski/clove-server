/* global global */
/* global it */
/* global describe */
/* global clove */
var request = require("request");
var assert = require("assert");
var atob = require("atob");
global.clove = require("../app/core");
var host = process.env.testing_host || ((clove.config.ssl ? "https" : "http") + "://127.0.0.1:" + clove.config.endpoint_port);

describe("Token Authentication API", function () {
    describe("password reset process", function () {
        it("should generate a proper token", function (done) {
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
        it("should provide a proper token when given correct credentials", function (done) {
            request.post({
                url: host + "/api/auth",
                json: {
                    username: "administrator",
                    password: "administrator"
                }
            }, function (err, resp, body) {
                assert.equal(resp.statusCode, 200, "login response status code must be 200");
                assert.equal(body.token !== "undefined" && body.token !== null, true);
                var payload = JSON.parse(atob(body.token.split(".")[1]));

                assert.notEqual(payload, null);
                assert.notEqual(payload.userAppDomains, null);
                assert.notEqual(payload.userAppDomains.length, 0);
                assert.notEqual(payload.userAppDomains[0].appDomain, null);
                assert.notEqual(payload.userAppDomains[0].claims, null);
                assert.notEqual(payload.userAppDomains[0].claims.length, 0);
                assert.notEqual(payload.userAppDomains[0].claims[0], null);
                assert.notEqual(payload.userAppDomains[0].claims[0].id, null);
                assert.notEqual(payload.userAppDomains[0].claims[0].name, null);

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
