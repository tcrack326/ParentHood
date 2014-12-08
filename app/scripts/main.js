Parse.initialize("cu3uLycT23GMhmWTRCAuEgM1I44LVHvdft4YL3ps", "SsEF54biIRFKzfscDlupAmCHAJJ7iQGQaWCHmsRE");

logOutUser = function() {
  Parse.User.logOut();
}


(function (){

  $(document).foundation();

  var app = angular.module('ParentHood', ['ngRoute', 'restangular']);

  app.config( function ($routeProvider, RestangularProvider) {

    RestangularProvider.setBaseUrl('https://api.parse.com/1/');
    RestangularProvider.setRestangularFields({
      id: 'objectId'
    });

    // set default header for Parse backend
    RestangularProvider.setDefaultHeaders({
      'X-Parse-Application-Id': 'cu3uLycT23GMhmWTRCAuEgM1I44LVHvdft4YL3ps', 'X-Parse-REST-API-Key': '3P5mOsEqFzJ0oEZpDtr36UnGwszbPVqwy7b2BYXh', 'Content-Type': 'application/json'
      });

      //define where the data is located in the response based on the operation
      RestangularProvider.setResponseExtractor(function(response, operation) {
        if (operation === 'getList'){

          return response.results;
        }

        else {

          return response;
        }

    });

    $routeProvider.when('/login', {
      templateUrl: 'templates/login.html',
      controller: 'LoginUserController'
    });

    $routeProvider.when('/signup', {
      templateUrl: 'templates/signup.html',
      controller: 'LoginUserController'
    });

    $routeProvider.when('/', {
      templateUrl: 'templates/main.html',
      controller: 'QuestionsController'
    });

    $routeProvider.when('/question/:id', {
      templateUrl: 'templates/singleQuestion.html',
      controller: 'SingleQuestionController'
    });

    $routeProvider.when('/editQuestion/:id', {
      templateUrl: 'templates/editQuestion.html',
      controller: 'SingleQuestionController'
    });

    $routeProvider.when('/add', {
      templateUrl: 'templates/add.html',
      controller: 'AddQuestionController'
    });

    $routeProvider.when('/tags/:searchText', {
      templateUrl: 'templates/main.html',
      controller: 'QuestionsController'
    });

    $routeProvider.when('/parent/:id', {
      templateUrl: 'templates/user-profile.html',
      controller: 'ProfileUserController'
    });

  });


  app.directive('logout', function (){

    return {
      link: function ($scope, element, attrs) {

        element.bind('click', function () {
          Parse.User.logOut();
        });
      }
    }
  });



}());
