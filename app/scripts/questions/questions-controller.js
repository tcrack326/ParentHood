(function () {

angular.module('ParentHood')
  .controller('QuestionsController', ['questionsFactory', 'usersFactory', '$scope', '$rootScope', '$location', function (questionsFactory, usersFactory, $scope, $rootScope, $location) {

  usersFactory.checkUser();

  questionsFactory.getQuestions().then( function (data) {
    $scope.questions = data;
  });

  $scope.logOutUser = function () {
    usersFactory.logOutUser();
  };

  }]);

}());
