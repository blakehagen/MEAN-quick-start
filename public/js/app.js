angular.module('quickStartTemplate', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {

  console.log('test');

  $stateProvider
    .state('example', {
      url: '/example',
      templateUrl: './app/features/example/exampleTmpl.html',
      controller: 'exampleCtrl as example'
    });

  $urlRouterProvider
    .otherwise('/example');
});