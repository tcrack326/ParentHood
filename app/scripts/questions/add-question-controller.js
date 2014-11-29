(function () {

  angular.module('ParentHood')
    .controller('AddQuestionController', ['questionsFactory', 'usersFactory', '$scope', '$rootScope', '$location', function (questionsFactory, usersFactory, $scope, $rootScope, $location) {

  usersFactory.checkUser();

  $scope.addQuestion = function (question) {
            var user = Parse.User.current();
            question.authorName = user.attributes.username;
            question.user = user.id;
            questionsFactory.addQuestion(question);

            $rootScope.$on('question:added', function () {
              $location.path('/');
            });

  }

    }]);

}());
