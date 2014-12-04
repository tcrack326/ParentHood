(function () {

  angular.module('ParentHood')
    .controller('AddQuestionController', ['questionsFactory', 'usersFactory', '$scope', '$rootScope', '$location', function (questionsFactory, usersFactory, $scope, $rootScope, $location) {

  usersFactory.checkUser();
  $scope.logOutUser = function () {
    usersFactory.logOutUser();
  };

  $scope.addQuestion = function (question) {
            var user = Parse.User.current();
            question.authorName = user.attributes.username;
            question.user = user.id;
            question.totalViews = 0;
            question.totalAnswers = 0;
            question.totalVotes = 0;
            questionsFactory.addQuestion(question);

            $rootScope.$on('question:added', function () {
              $location.path('/');
            });

  }

    }]);

}());
