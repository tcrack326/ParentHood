(function () {

  angular.module('ParentHood')
    .controller('AddQuestionController', ['questionsFactory', '$scope', '$rootScope', '$location', function (questionsFactory, $scope, $rootScope, $location) {


  $scope.addQuestion = function (question) {
            questionsFactory.addQuestion(question);

            $rootScope.$on('question:added', function () {
              $location.path('/');
            });

  }

    }]);

}());
