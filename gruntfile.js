module.exports = function(grunt) {
    var path = require("path");
    var config = require("./config/config");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        watch: {
            files: ["app/**/*.js", "models/**/*.js"],
            options: {nospawn: true},
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
            setup_test: {
                command: "sequelize db:migrate --env test --config ./config/db.json & node " +
                         path.resolve("./seeders/test_data.js") + " test",
                env: {
                    NODE_ENV: "test"
                }
            },
            run_tests: {
                command: "mocha tests",
                env: {
                    NODE_ENV: "test"
                }
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

    grunt.registerTask("wipe_test", function () {
        process.env.NODE_ENV = "test";
        var fs = require("fs");
        if (fs.existsSync(path.resolve("db.test.sqlite"))) {
            fs.unlinkSync(path.resolve("db.test.sqlite"));
        }
    });
    
    
    var clearCache = function() {
        for (var key in require.cache) {
            if (key.indexOf(__dirname) > -1 && key.indexOf("node_modules") == -1) {
                console.log("Invalidating cache: " + key);
                delete require.cache[key];
            }
        }
    };
    
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
        "wipe_test", 
        "shell:setup_test", 
        "serve:start", 
        "wait", 
        "continue:on", 
        "mochaTest", 
        "continue:off", 
        "serve:stop"
    ]);


    
    grunt.registerTask("serve:start", "Start server", function() {
        console.log(global.clove !== undefined ? "Existing server instance located": "No Server Instance Found");
        var http = require("http");
        var done = this.async();
        var startup = function() {
            console.log("Starting Clove Server...");
            clearCache();
            var app = require("./app.js");
            
            clove._server = http.createServer(app).listen(clove.config.port, function() {
                console.log("Clove app server listening");
                done();
            });
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
    });
    
    grunt.registerTask("serve:stop", "Stop server", function() {
        console.log("Server Stop Task");
        if (global.clove !== undefined) {
            clove._server.close();
        }
    });
};