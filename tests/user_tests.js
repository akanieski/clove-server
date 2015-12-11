/* global global */
/* global it */
/* global describe */
/* global clove */
var request = require("request");
var assert = require("assert");
global.clove = require("../app/core");
var host = "http://127.0.0.1:" + clove.config.port;

describe("User API", function () {
    describe("api/user", function() {
        it("should post new user sign up", function(done) {
           request.post({
                url: host + "/api/user",
                json: {
                    username: "testuser",
                    password: "TestPassword00#",
                    password2: "TestPassword00#x",
                    first_name: "test",
                    last_name: "user",
                    email: "a@a.com"
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 200, "sign up response status code must be 200");
                assert.equal(body.data !== "undefined" && body.data !== null && body.data.id > 0, true);
                done();
            });
       });
        it("should return field errors for invalid data", function(done) {
           request.post({
                url: host + "/api/user",
                json: {
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 420, "invalid sign up request should have a response status code of 420");
                assert.equal(body.data !== "undefined" && body.errors !== null, true);
                assert.equal(body.errors.username !== null, true);
                assert.equal(body.errors.email !== null, true);
                assert.equal(body.errors.first_name !== null, true);
                assert.equal(body.errors.last_name !== null, true);
                assert.equal(body.errors.password !== null, true);
                done();
            });
       });
        it("should return field errors for non-unique data", function(done) {
           request.post({
                url: host + "/api/user",
                json: {
                    username: "testuser",
                    password: "TestPassword00#",
                    password2: "TestPassword00#",
                    first_name: "test",
                    last_name: "user",
                    email: "a@a.com"
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 420, "invalid sign up request should have a response status code of 420");
                assert.equal(body.data !== "undefined" && body.errors !== null, true);
                assert.equal(body.errors.username !== null, true);
                assert.equal(body.errors.email !== null, true);
                done();
            });
       });
    });
});