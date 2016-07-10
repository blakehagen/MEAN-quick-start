angular.module('quickStartTemplate', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('example', {
      url: '/example',
      templateUrl: './js/app/features/example/exampleTmpl.html',
      controller: 'exampleCtrl as example'
    });

  $urlRouterProvider
    .otherwise('/');

});