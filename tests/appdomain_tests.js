/* global global */
/* global it */
/* global describe */
/* global clove */
var request = require("request");
var assert = require("assert");
global.clove = require("../app/core");

var host = (clove.config.ssl ? "https" : "http") + "://127.0.0.1:" + clove.config.endpoint_port;
function GetToken(username, password, next) {
    request.post({
        url: host + "/api/auth",
        json: {
            username: username,
            password: password
        }
    }, function (err, resp, body) {
        next(body.token);
    });
}

describe("App Domain API", function () {

    it("should post new app domain", function(done) {
        GetToken("administrator", "administrator", function(token){
            request.post({
                url: host + "/api/appdomain",
                json: {
                    name: "Test App Domain 2",
                },
                headers: {
                    "Authorization": "Bearer " + token
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 200, "new app domain response status code must be 200");
                assert.equal(body.data !== "undefined" && body.data !== null && body.data.id > 0, true, "response should contain new app domain");
                assert.equal(body.data.user_id > 0 , true, "new app domain should be created under the current user");
                
                done();
            });
        });
    });
    
    it("should get existing app domain", function(done) {
        GetToken("administrator","administrator",function(token){
            request.get({
                url: host + "/api/appdomain/1",
                json: {},
                headers: {
                    "Authorization": "Bearer " + token
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 200, "existing app domain response status code must be 200");
                assert.equal(body.data !== "undefined" && body.data !== null && body.data.id > 0, true, "response should contain new app domain");

                done();
            });
        });
    });
    
    it("should not get existing app domain of another user", function(done) {
        GetToken("administrator2","administrator",function(token){
            request.get({
                url: host + "/api/appdomain/1",
                json: {},
                headers: {
                    "Authorization": "Bearer " + token
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 401, "existing app domain response status code must be 401");
                assert.equal(body.data, null, "response should contain new app domain");

                done();
            });
        });
    });
    
    it("should not post new app domain if not authorized", function(done) {
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

});