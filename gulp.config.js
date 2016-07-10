module.exports = function () {
  var public = './public/';
  var server = './server/';

  var config = {
    appJS: [
      // FIRST LOAD THE APP.JS FILE //
      public + 'js/app.js',
      // REST OF APP JS //
      public + 'js/app/**/*.js'
    ],
    appJSVendor: [
      // ANGULAR FIRST //
      public + 'js/vendor/angular/angular.min.js',
      // OTHER 3RD PARTY LIBRARIES //
      public + 'js/vendor/**/*.js'
    ],
    build: './build/',
    htmlTemplates: public + 'js/app/**/*.html',
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'quickStartTemplate',
        standAlone: false,
        root: './'
      }
    }


  };

  return config;
};