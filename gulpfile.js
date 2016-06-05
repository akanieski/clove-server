/* global exec */
/* global process */
/* global clove */
var gulp = require('gulp'),
    fs = require('fs'),
    path = require('fs'),
    dbTasks = require('./node_modules/sequelize-cli/lib/tasks/db'),
    child_process = require('child_process'),
    mocha = require('gulp-mocha'),
    path = require('path'),
    fs = require('fs'),
    jscs = require('gulp-jscs'),
    runSequence = require('run-sequence'),
    gutil = require('gulp-util'),
    exec = require('child_process').exec;

gulp.task('wipedb', function(done) {
    // get db config
    console.log("Starting wipe db task");
    var clove = require('./app/core')(),
        db = clove.db,
        config = clove.config;
        
    if (config.dialect == 'sqlite') {
        console.log('Deleting SQLITE db');
        try {
            if (fs.statSync(config.storage)) {
                fs.unlink(config.storage, function(err) {
                    if (err) {
                        throw err;
                    } else {
                        done();
                    }
                });
            }
            else {
                done();
            }
        } catch (err) {
            done();
        }
    } else if (config.dialect == 'mysql') {
        var dbName = db.sequelize.config.database;
        delete db.sequelize.config.database;
        delete db.sequelize.connectionManager.config.database;
        delete db.sequelize.options.database;
        
        console.log('Deleting MYSQL db');
        db.sequelize.query(`drop database if exists ${dbName};`).then(function(results){
            db.sequelize.query(`create database ${dbName};`).then(function(result){
                db.sequelize.config.database = dbName;
                db.sequelize.options.database = dbName;
                db.sequelize.connectionManager.config.database = dbName;
                done(); 
            });
        }).catch(function(err) {
            throw err;
        });
    } else if (config.dialect == 'mssql') {
        var dbName = db.sequelize.config.database;
        delete db.sequelize.config.database;
        delete db.sequelize.connectionManager.config.database;
        delete db.sequelize.options.database;
        console.log('Deleting MSSQL db');
        db.sequelize.query(`
            USE master;
            IF EXISTS(select * from sys.databases where name='${dbName}')
                DROP DATABASE ${dbName};
            CREATE DATABASE ${dbName};
        `).then(function(results){
            console.log(results);
            db.sequelize.config.database = dbName;
            db.sequelize.options.database = dbName;
            db.sequelize.connectionManager.config.database = dbName;
            done();
        }).catch(function(err) {
            console.log(err);
            throw err;
        });
    }
});

gulp.task('mocha:test', function() {
    return gulp.src('tests/*.js')
        .pipe(mocha({timeout: 10000}))
        .once('error', function(err) {
            console.log(err);
            process.exit(1);
        })
        .once('end', function() {
            process.exit();
        });
});

gulp.task('run_tests', function(cb){
    
    gutil.log(child_process.execSync('mocha tests').toString());
    cb();
});

gulp.task('migrate', dbTasks['db:migrate'].task);

gulp.task('seed:master', function(cb){
    child_process.execSync(path.resolve('./node_modules/.bin/sequelize') + ' db:seed:all --seeders-path=./seeders/master --config=./config/local.js').toString();
    cb();
});

gulp.task('migrate', function(cb){
    child_process.execSync(path.resolve('./node_modules/.bin/sequelize') + ' db:migrate --config=./config/local.js').toString();
    cb();
});

gulp.task('seed:test', function(cb) {
    child_process.execSync(path.resolve('./node_modules/.bin/sequelize') + ' db:seed:all --seeders-path=./seeders/test --config=./config/local.js').toString();
    cb();
});

gulp.task('serve', function(done){
    var CloveApp = require('./app');
    var app = new CloveApp({
        logger: gutil.log
    }, function(){
        done();
    });
});

gulp.task('test', function(cb) {
    runSequence('wipedb', 'migrate', 'seed:master', 'seed:test', 'serve', 'mocha:test', cb);
});

gulp.on('error', function(e) {
    gutil.log(e);
});

gulp.task('jscs', function() {
    return gulp.src('app/**/*.js')
        .pipe(jscs({fix: true}))
        .pipe(jscs.reporter())
        .pipe(jscs.reporter('fail'))
        .pipe(gulp.dest('app'));
});