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
    if (fs.existsSync('db.' + process.env.NODE_ENV + '.sqlite')) {
        fs.unlink('db.' + process.env.NODE_ENV + '.sqlite', function(err) {
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
});

gulp.task('mocha:test', function() {
    return gulp.src('tests/*.js')
        .pipe(mocha())
        .once('error', function() {
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
    console.log(path.resolve('./node_modules/.bin/sequelize'));
    console.log(fs.existsSync(path.resolve('./node_modules/.bin/sequelize')));
    child_process.execSync(path.resolve('./node_modules/.bin/sequelize') + ' db:seed:all --seeders-path=./seeders/master').toString();
    cb();
});

gulp.task('migrate', function(cb){
    child_process.execSync(path.resolve('./node_modules/.bin/sequelize') + ' db:migrate').toString();
    cb();
});

gulp.task('seed:test', function(cb) {
    child_process.execSync(path.resolve('./node_modules/.bin/sequelize') + ' db:seed:all --seeders-path=./seeders/test').toString();
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