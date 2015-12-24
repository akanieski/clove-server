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

describe("Claims API", function () {

    it("should get existing claim", function(done) {
        GetToken("administrator", "administrator", function(token){
            request.get({
                url: host + "/api/claim/1",
                json: {},
                headers: {
                    "Authorization": "Bearer " + token
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 200, "existing claim response status code must be 200");
                assert.equal(body.data !== "undefined" && body.data !== null && body.data.id > 0, true, "response should contain existing claim");
                
                done();
            });
        });
    });

    it("should not get non-existent claim", function(done) {
        GetToken("administrator", "administrator", function(token){
            request.get({
                url: host + "/api/claim/0",
                json: {},
                headers: {
                    "Authorization": "Bearer " + token
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 404, "non-existent claim response status code must be 404");
                assert.equal(body.data, null, "response should not contain claim");
                
                done();
            });
        });
    });

    it("should get existing claims", function(done) {
        GetToken("administrator", "administrator", function(token){
            request.get({
                url: host + "/api/claims",
                json: {},
                headers: {
                    "Authorization": "Bearer " + token
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 200, "existing claims response status code must be 200");
                assert.notEqual(body.data, null, "response should contain existing claims");
                
                done();
            });
        });
    });

    it("should update existing claim", function(done) {
        GetToken("administrator", "administrator", function(token){
            request.get({
                url: host + "/api/claim/1",
                json: {},
                headers: {
                    "Authorization": "Bearer " + token
                }
            }, function (err, resp, data) {
                var newData = {
                    name: data.data.name,
                    description: data.data.description + "."
                };
                request.put({
                    url: host + "/api/claim/1",
                    json: newData,
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }, function (err, resp, body) {
                    
                    assert.equal(resp.statusCode, 200, "existing claim response status code must be 200");
                    assert.equal(body.data !== "undefined" && body.data !== null && body.data.id > 0, true, "response should contain existing claim");
                    assert.equal(newData.description, body.data.description);
                    
                    done();
                    
                });
            });
        });
    });

    it("should create new claim", function(done) {
        GetToken("administrator", "administrator", function(token){
            request.post({
                url: host + "/api/claim",
                json: {
                    name: "Test Claim",
                    description: "Test Claim"
                },
                headers: {
                    "Authorization": "Bearer " + token
                }
            }, function (err, resp, body) {
                
                assert.equal(resp.statusCode, 200, "create claim response status code must be 200");
                assert.equal(body.data !== "undefined" && body.data !== null && body.data.id > 0, true, "response should contain new claim");
                
                done();
                
            });
        });
    });

});