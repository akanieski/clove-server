/* jshint node: true */
"use strict";
module.exports = function (options) {
    options = options || {};
    var utils = {},
        crypto = require("crypto"),
        algorithm = "aes-256-ctr",
        password = options.secret || "a42cb199-f35c-42ce-b6cd-8669dcd8e6b2";
    
    utils.colors = require("colors");

    utils.encrypt = function (text) {
        var cipher = crypto.createCipher(algorithm, password);
        var crypted = cipher.update(text, "utf8", "hex");
        crypted += cipher.final("hex");
        return crypted;
    };
    
    utils.decrypt = function (text) {
        var decipher = crypto.createDecipher(algorithm, password);
        var dec = decipher.update(text, "hex", "utf8");
        dec += decipher.final("utf8");
        return dec;
    };
    
    utils.uuid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    };
    
    utils.check_password = function(password) {
    
        var PASSWORD_REQUIREMENTS = clove.config.password_strength;
        var error = null;
        password = password || "";
        
        if (!password) {
            error = "Password is required";
            return error;
        }
        
        if (PASSWORD_REQUIREMENTS.minLength > password.length) {
            error = "Password requires at least " + PASSWORD_REQUIREMENTS.minLength + " characters";
            return error;
        }
        
        if (PASSWORD_REQUIREMENTS.capitals && 
            !/^(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
            error = "Password requires at least one upper case and one lower case character";
        }
        
        if (PASSWORD_REQUIREMENTS.numbers && 
            !/^(?=.*\d)/.test(password)) {
            error = "Password requires at least one number";
        }
        
        if (PASSWORD_REQUIREMENTS.specialCharacters && 
            !/^(?=.*[#$@$!%*?&])/.test(password)) {
            error = "Password requires as least one special character eg. #$@$!%*?&";
        }
        
        return error;
        
    };

    utils.check_email = function(email) {
        return new RegExp(["^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)",
                          "*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|",
                          "com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|tr",
                          "avel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3",
                          "}\.[0-9]{1,3}))(:[0-9]{1,5})?$"].join("")).test(email);
    };
    
    utils.equals = function(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    return utils;

};


// Prototypal Utilities

/**
 * C# style string format function
**/
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != "undefined" ? args[number] : match;
        });
    };
}