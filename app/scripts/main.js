(function (){

  var app = angular.module('ParentHood', ['ngRoute', 'restangular']);

  app.config( function ($routeProvider, RestangularProvider) {

    RestangularProvider.setBaseUrl('http://api.parse.com/1/classes/');
    RestangularProvider.setRestangularFields({
      id: 'objectId'
    });

    // set default header for Parse backend
RestangularProvider.setDefaultHeaders({"X-Parse-Application-Id: cu3uLycT23GMhmWTRCAuEgM1I44LVHvdft4YL3ps", "X-Parse-REST-API-Key: 3P5mOsEqFzJ0oEZpDtr36UnGwszbPVqwy7b2BYXh", "Content-Type: application/json"});


    $routeProvider.when('/', {
      templateUrl: 'templates/main.html',
      controller: 'QuestionsController'
    });

    $routeProvider.when('/edit/:id', {
      templateUrl: 'templates/edit.html',
      controller: 'EditQuestionController'
    });

    $routeProvider.when('/add', {
      templateUrl: 'templates/add-template.html',
      controller: 'AddQuestionController'
    });

  });



}());
