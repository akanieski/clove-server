/* global global */
/* global clove */
module.exports = function (grunt) {
    var path = require("path");
    var fs = require("fs");
    var config = require("./config/config");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        js_beautify: {
            options: {
                "indent_size": 4,
                "indent_char": " ",
                "indent_level": 0,
                "indent_with_tabs": false,
                "preserve_newlines": true,
                "max_preserve_newlines": 10,
                "jslint_happy": false,
                "space_after_anon_function": true,
                "brace_style": "collapse",
                "keep_array_indentation": false,
                "keep_function_indentation": false,
                "space_before_conditional": true,
                "break_chained_methods": false,
                "eval_code": false,
                "unescape_strings": false,
                "wrap_line_length": 0,
                "wrap_attributes": "auto",
                "wrap_attributes_indent_size": 4,
                "end_with_newline": true
            },
            files: ['*.js', 'app/**/*.js', 'migrations/*.js', 'tests/*.js'],
        },
        watch: {
            files: ["app/**/*.js", "models/**/*.js"],
            options: {
                nospawn: true
            },
            tasks: ["serve:stop", "serve:start", "watch"]
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: ["tests/**/*.js"]
            }
        },
        shell: {
            seed: {
                command: "node " + path.resolve("./seeders/test_data.js")
            },
            migrate: {
                command: "sequelize db:migrate",
            },
            run_tests: {
                command: "mocha tests"
            },
        },
        wait: {
            options: {
                delay: 1200
            },
        },
        jshint: {
            files: ["Gruntfile.js", "seeders/**/*.js", "tests/**/*.js", "app/**/*.js", "*.js"],
            options: {
                reporter: require("jshint-stylish"),
                // options here to override JSHint defaults
                globals: {
                    require: true,
                    module: true,
                    __dirname: true,
                    clove: true,
                    process: true,
                    it: true,
                    describe: true
                }
            }
        },
        jscs: {
            main: "app.js",
            app: {
                src: ["Gruntfile.js", "seeders/**/*.js", "tests/**/*.js", "app/**/*.js", "*.js"],
            }
        }

    });

    grunt.registerTask("wipe", function () {
        var clove = require("./app/core");
        if (clove.config.dialect == "sqlite") {
            var fs = require("fs");
            if (fs.existsSync(path.resolve(clove.config.storage))) {
                fs.unlinkSync(path.resolve(clove.config.storage));
            }
        }
    });


    var clearCache = function () {
        for (var key in require.cache) {
            if (key.indexOf(__dirname) > -1 && key.indexOf("node_modules") == -1) {
                delete require.cache[key];
            }
        }
    };

    grunt.loadNpmTasks('grunt-js-beautify');
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-continue");
    grunt.loadNpmTasks("grunt-wait");
    grunt.loadNpmTasks("grunt-jscs");


    grunt.registerTask("default", ["serve:start", "watch"]);
    grunt.registerTask("build", ["jshint", "jscs"]);
    grunt.registerTask("test", [
        "wipe",
        "shell:migrate",
        "shell:seed",
        "serve:start",
        "wait",
        "mochaTest",
        "serve:stop"
    ]);



    grunt.registerTask("serve:start", "Start server", function () {
        if (!process.env.testing_host) {
            var done = this.async();
            console.log(global.clove !== undefined ? "Existing server instance located" : "No Server Instance Found");

            var startup = function () {
                console.log("Starting Clove Server...");
                clearCache();
                var app = require("./app.js");
                var http = clove.config.ssl ? require("https") : require("http");
                if (clove.config.ssl) {
                    clove._server = http.createServer({
                        key: fs.readFileSync(path.resolve(clove.config.ssl.key)),
                        cert: fs.readFileSync(path.resolve(clove.config.ssl.crt))
                    }, app).listen(clove.config.endpoint_port, function () {
                        console.log("Clove server listening on port %s using the '" + clove.env + "' environment.", clove.config.endpoint_port);
                        setTimeout(done, 1000);
                    });
                } else {
                    clove._server = http.createServer(app).listen(clove.config.endpoint_port, function () {
                        console.log("Clove server listening on port %s using the '" + clove.env + "' environment.", clove.config.endpoint_port);
                        setTimeout(done, 1000);
                    });
                }
            };

            if (global.clove !== undefined) {
                console.log("Stopping Clove Server...");
                console.log(clove._server.close);
                clove._server.close();
                clearCache();
                startup();
            } else {
                startup();
            }
        } else {
            console.log("Testing host has been set: " + process.env.testing_host);
        }
    });

    grunt.registerTask("serve:stop", "Stop server", function () {
        console.log("Server Stop Task");
        if (global.clove !== undefined) {
            clove._server.close();
        }
    });
};
