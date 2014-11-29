(function () {

  angular.module('ParentHood')
    .controller('SingleQuestionController', ['questionsFactory', 'usersFactory', '$scope', '$routeParams', '$rootScope', '$location', function (questionsFactory, usersFactory, $scope, $routeParams, $rootScope, $location) {

    usersFactory.checkUser();

    questionsFactory.getQuestion($routeParams.id).then(function (data){

    $scope.question = data;

  });


  $scope.updateQuestion = function (question) {

    questionsFactory.updateQuestion(question);

    $rootScope.$on('question:updated', function (){
      $location.path('/');
    });

  }

  $scope.deleteQuestion = function (question) {
    questionsFactory.deleteQuestion(question);

    $rootScope.$on('question:deleted', function (){
      $location.path('/');
    });

  }

    }]);

}());
