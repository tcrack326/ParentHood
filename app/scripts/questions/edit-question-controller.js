(function () {

  angular.module('ParentHood')
    .controller('EditQuestionController', ['questionsFactory', '$scope', '$routeParams', '$rootScope', '$location', function (choresFactory, $scope, $routeParams, $rootScope, $location) {

  questionsFactory.getQuestion($routeParams.id).then(function (data){

    $scope.question = data.result;

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
