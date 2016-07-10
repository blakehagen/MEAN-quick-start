'use strict';
const gulp     = require('gulp');
const taskList = require('gulp-task-listing');
const jshint   = require('gulp-jshint');
const jscs     = require('gulp-jscs');
const util     = require('gulp-util');
const gprint   = require('gulp-print');
const gulpif   = require('gulp-if');

// DEFAULT GULP CHECK  & LIST GULP TASKS //
gulp.task('default', function () {
  log('Hi. I\'m Gulp. Let\'s do this...');
  log('Showing available Gulp tasks...');
  taskList();
});


//  CHECK ALL JS CODE WITH JSHINT & JSCS //
gulp.task('js-check', function () {
  log('Checking JS files with jshint and jscs...');
  return gulp.src(config.appJS)
    .pipe(gulpif(args.verbose, gprint()))
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe(jshint.reporter('fail'));
});


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