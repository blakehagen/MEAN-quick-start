'use strict';
// GULP CONFIG FILE //
const config = require('./gulp.config')();
const gulp                 = require('gulp');
const taskList             = require('gulp-task-listing');
const jshint               = require('gulp-jshint');
const jscs                 = require('gulp-jscs');
const util                 = require('gulp-util');
const gprint               = require('gulp-print');
const gulpif               = require('gulp-if');
const gconcat              = require('gulp-concat');
const minifyHtml           = require('gulp-minify-html');
const minifyCss            = require('gulp-minify-css');
const less                 = require('gulp-less');
const inject               = require('gulp-inject');
const autoprefixer         = require('gulp-autoprefixer');
const plumber              = require('gulp-plumber');
const angularTemplateCache = require('gulp-angular-templatecache');
const uglify               = require('gulp-uglify');
const strip                = require('gulp-strip-debug');
const ngAnnotate           = require('gulp-ng-annotate');
const gnodemon             = require('gulp-nodemon');
const args                 = require('yargs').argv;
const del                  = require('del');
const browserSync          = require('browser-sync');
const port                 = process.env.PORT || config.defaultPort;

// DEFAULT GULP CHECK & LIST GULP TASKS //
gulp.task('default', function () {
  log('Hi. I\'m Gulp. Let\'s do this...');
  log('Showing available Gulp tasks...');
  taskList();
});

// CLEAN BUILD FOLDER //
gulp.task('clean-build', function (done) {
  clean(config.build);
  log('Cleaning up your mess...');
  done();
});

//  CHECK ALL JS CODE WITH JSHINT & JSCS //
gulp.task('js-check', function (done) {
  log('Checking JS files with jshint and jscs...');
  return gulp.src(config.appJS)
    .pipe(gulpif(args.verbose, gprint()))
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe(jshint.reporter('fail'));
});

gulp.task('template-cache', function (done) {
  log('Creating Angular $templateCache...');
  return gulp.src(config.htmlTemplates)
    .pipe(minifyHtml({empty: true}))
    .pipe(angularTemplateCache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(gulp.dest(config.build + 'templates'));
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
gulp.task('optimize-js', ['template-cache', 'optimize-appJs', 'optimize-vendorJs'], function () {
  log('OPTIMIZING ALL JS...');
});

// COMPILE LESS --> CSS, CONCAT & MINIFY --> BUILD //
gulp.task('compile-less', function (done) {
  log('Compiling LESS --> CSS...');
  return gulp.src(config.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(gconcat('app.css'))
    .pipe(minifyCss())
    .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.build + 'styles'));
  done();
});

// CONCAT & MINIFY VENDOR CSS  --> BUILD //
gulp.task('optimize-vendor-css', function (done) {
  log('Concat and minify VENDOR CSS...');
  gulp.src(config.cssVendor)
    .pipe(gconcat('lib.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(config.build + 'styles'));
  done();
});

// OPTIMIZE ALL STYLES --> BUILD //
gulp.task('optimize-styles', ['compile-less', 'optimize-vendor-css'], function () {
  log('OPTIMIZING ALL STYLES...');
});

// INJECT FILES TO BUILD INDEX //
gulp.task('inject', ['optimize-js', 'optimize-styles'], function () {
  log('Injecting assets into build index...');
  var templateCache = config.build + 'templates/' + config.templateCache.file;
  var jsLib         = config.build + 'js/lib.js';
  var jsApp         = config.build + 'js/app.js';
  var cssLib        = config.build + 'styles/lib.css';
  var cssApp        = config.build + 'styles/app.css';

  return gulp.src(config.index)
    .pipe(plumber())
    .pipe(inject(gulp.src(templateCache, {read: false}), {
      starttag: '<!-- inject:templates:js -->',
      ignorePath: 'build'
    }))
    .pipe(inject(gulp.src(jsLib, {read: false}), {starttag: '<!-- inject:lib:js -->', ignorePath: 'build'}))
    .pipe(inject(gulp.src(jsApp, {read: false}), {starttag: '<!-- inject:app:js -->', ignorePath: 'build'}))
    .pipe(inject(gulp.src(cssLib, {read: false}), {starttag: '  <!-- inject:lib:css -->', ignorePath: 'build'}))
    .pipe(inject(gulp.src(cssApp, {read: false}), {starttag: '<!-- inject:app:css -->', ignorePath: 'build'}))
    .pipe(gulp.dest(config.build));
});

// OPTIMIZE BUILD //
gulp.task('build', ['inject'], function () {
  log('Serving up the awesomeness...');
  serve();
});


// ================ //
// ==== HELPERS === //
// ================ //


// SERVE IT UP //
function serve() {
  var nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': 'dev'
    },
    watch: [config.server]
  };
  return gnodemon(nodeOptions)
    .on('restart', function (ev) {
      log('**** nodemon restarted ****');
      log('files changed on restart:\n' + ev);
      setTimeout(function () {
        browserSync.notify('reloading...');
        browserSync.reload({steam:false});
      }, 1000);
    })
    .on('start', function () {
      log('**** nodemon started ****');
      startBrowserSync();
    })
    .on('crash', function () {
      log('**** nodemon crashed ****');
    })
    .on('exit', function () {
      log('**** nodemon exited ****');
    });
}

function changeEvent(event) {
  log('File ===> ' + event.path + ' ' + event.type);
}

function startBrowserSync() {
  console.log('browserSync Active? ', browserSync.active);
  if (args.nosync || browserSync.active) {
    return;
  }
  log('Starting browserSync on port ' + port);

  // if (isDev) {
  //   gulp.watch([config.less], ['styles'])
  //     .on('change', function (event) {
  //       changeEvent(event);
  //     });
  // } else {
  //   gulp.watch([config.less, config.appJS, config.html], ['optimize', browserSync.reload])
  //     .on('change', function (event) {
  //       changeEvent(event);
  //     });
  // }
  gulp.watch([config.less, config.css, config.appJS, config.htmlTemplates], ['inject', browserSync.reload])
    .on('change', function (event) {
      changeEvent(event);
      console.log('hi');
    });

  var options = {
    proxy: 'localhost:' +  port,
    port: 3000,
    files: [config.public + '**/*.*'],
    injectChanges: true,
    logFileChanges: true,
    notify: true,
    reloadDelay: 1000
  };
  browserSync(options);
}

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