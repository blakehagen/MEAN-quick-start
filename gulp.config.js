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
    css: public + 'styles/appStyles/**/*.css',
    cssVendor: public + 'styles/vendorStyles/**/*.css',
    defaultPort: 5500,
    htmlTemplates: public + 'js/app/**/*.html',
    index: public + 'index.html',
    less: [
      public + 'styles/vendorStyles/**/*.less',
      public + 'styles/appStyles/**/*.less'
    ],
    nodeServer: 'server.js',
    server: ['server.js','./server'],
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'quickStartTemplate',
        standAlone: false,
        root: './app'
      }
    }
  };
  return config;
};