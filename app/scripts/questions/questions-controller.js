(function () {

angular.module('ParentHood')
  .controller('QuestionsController', ['questionsFactory', '$scope', '$rootScope', '$location', function (questionsFactory, $scope, $rootScope, $location) {

  questionsFactory.getQuestions().then( function (data) {
    $scope.questions = data.results;
  });

  }]);

}());
