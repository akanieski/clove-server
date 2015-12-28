/* global global */
/* global it */
/* global describe */
/* global clove */
var request = require("request");
var assert = require("assert");
var path = require("path");
var EmailService = require("../app/services/email");
global.clove = require("../app/core");

describe("Email Services", function () {

    it("render a basic html email", function (done) {

        var emailer = new EmailService();

        emailer.on("rendered", function (err, content) {
            assert.equal(err, null);
            assert.notEqual(content, null);
            done();
        });

        emailer.render(path.resolve("./app/templates/email_one_column.html"));

    });


    it("render a basic ejs email", function (done) {

        var emailer = new EmailService();

        emailer.on("rendered", function (err, content) {
            assert.equal(err, null);
            assert.equal(content.indexOf("John, Doe") > -1, true);
            done();
        });

        emailer.render(path.resolve("./app/templates/email_tests.ejs"), {
            firstName: "John",
            lastName: "Doe"
        });

    });


    it("render an ejs email with include statements", function (done) {

        var emailer = new EmailService();

        emailer.on("rendered", function (err, content) {
            assert.equal(err, null, err);
            assert.equal(
                content.indexOf("CONTENT") > -1 &&
                content.indexOf("HEADER") > -1 &&
                content.indexOf("FOOTER") > -1, true);
            done();
        });

        emailer.render(path.resolve("./app/templates/email_one_column.ejs"), {
            firstName: "John",
            lastName: "Doe"
        });

    });


    it("send an email using basic html template", function (done) {

        var emailer = new EmailService();

        emailer.on("sent", function (err, content) {
            if (err) {
                console.log(err);
            }
            assert.equal(err, null);
            done();
        });

        emailer.send({
            config: clove.config.smtp.system,
            view: path.resolve("./app/templates/email_one_column.html")
        });

    });


    it("send an email using ejs templates", function (done) {

        var emailer = new EmailService();

        emailer.on("sent", function (err, content) {
            assert.equal(err, null);
            done();
        });

        emailer.send({
            config: clove.config.smtp.system,
            view: path.resolve("./app/templates/email_one_column.ejs")
        });

    });

});
