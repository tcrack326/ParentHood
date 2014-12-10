(function () {

  angular.module('ParentHood')
    .controller('AddQuestionController', ['questionsFactory', 'usersFactory', 'userStatsFactory', '$scope', '$rootScope', '$location', function (questionsFactory, usersFactory, userStatsFactory, $scope, $rootScope, $location) {

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
            question.hasViewed = [];
            question.userImageURL;
            userStatsFactory.getUserStats(user.id).then( function(data){
              var userStats = data[0];
              userStats.questionsAsked++;
              userStatsFactory.updateUserStats(userStats);
              question.userImageURL = userStats.imageURL;
              questionsFactory.addQuestion(question);
            });




            $rootScope.$on('question:added', function () {
              $location.path('/');
            });

  }

    }]);

}());
