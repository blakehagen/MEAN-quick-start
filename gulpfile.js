'use strict';
const gulp                 = require('gulp');
const taskList             = require('gulp-task-listing');
const jshint               = require('gulp-jshint');
const jscs                 = require('gulp-jscs');
const util                 = require('gulp-util');
const gprint               = require('gulp-print');
const gulpif               = require('gulp-if');
const gconcat              = require('gulp-concat');
const minifyHtml           = require('gulp-minify-html');
const angularTemplateCache = require('gulp-angular-templatecache');
const uglify               = require('gulp-uglify');
const strip                = require('gulp-strip-debug');
const ngAnnotate           = require('gulp-ng-annotate');
const args                 = require('yargs').argv;
const del                  = require('del');


// GULP CONFIG FILE //
const config = require('./gulp.config')();

// DEFAULT GULP CHECK & LIST GULP TASKS //
gulp.task('default', function () {
  log('Hi. I\'m Gulp. Let\'s do this...');
  log('Showing available Gulp tasks...');
  taskList();
});

// CLEAN BUILD FOLDER //
gulp.task('clean-build', function () {
  clean(config.build);
});

//  CHECK ALL JS CODE WITH JSHINT & JSCS //
gulp.task('js-check', function (done) {
  log('Checking JS files with jshint and jscs...');
  var stream = gulp.src(config.appJS)
    .pipe(gulpif(args.verbose, gprint()))
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe(jshint.reporter('fail'));
  return stream;
});

gulp.task('template-cache', function (done) {
  log('Creating Angular $templateCache...');
  var stream = gulp.src(config.htmlTemplates)
    .pipe(minifyHtml({empty: true}))
    .pipe(angularTemplateCache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(gulp.dest(config.build + 'templates'));
  return stream;
});

// CONCAT, STRIP & MINIFY VENDOR JS  --> BUILD //
gulp.task('optimize-vendorJs', ['js-check'], function (done) {
  log('Concat, strip, and minify VENDOR JS...');
  gulp.src(config.appJSVendor)
    .pipe(gconcat('lib.js'))
    .pipe(strip())
    .pipe(uglify())
    .pipe(gulp.dest(config.build + 'js'));
  done();
});

// NG-ANNOTATE, CONCAT, STRIP & MINIFY APP JS  --> BUILD //
gulp.task('optimize-appJs', ['js-check'], function (done) {
  log('Ng-Annotate, Concat, strip, and minify APP JS...');
  gulp.src(config.appJS)
    .pipe(ngAnnotate())
    .pipe(gconcat('app.js'))
    .pipe(strip())
    .pipe(uglify())
    .pipe(gulp.dest(config.build + 'js'));
  done();
});


// OPTIMIZE VENDOR AND APP JS --> BUILD //
gulp.task('optimize-js', ['js-check', 'template-cache', 'optimize-appJs', 'optimize-vendorJs'], function () {
  log('OPTIMIZING ALL JS...');
});


// ================ //
// ==== HELPERS === //
// ================ //

// LOG FUNCTION //
function log(msg) {
  if (typeof (msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        util.log(util.colors.blue(msg[item]));
      }
    }
  } else {
    util.log(util.colors.blue(msg));
  }
}

// FUNCTION TO CLEAN FILES //
function clean(path) {
  log('Cleaning: ' + util.colors.blue(path));
  del(path);
}