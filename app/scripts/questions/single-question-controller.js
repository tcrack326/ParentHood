(function () {

  angular.module('ParentHood')
    .controller('SingleQuestionController', ['questionsFactory', 'usersFactory', 'answersFactory', '$scope', '$routeParams', '$rootScope', '$location', function (questionsFactory, usersFactory, answersFactory, $scope, $routeParams, $rootScope, $location) {

    usersFactory.checkUser();
    $scope.logOutUser = function () {
      usersFactory.logOutUser();
    };


    questionsFactory.getQuestion($routeParams.id).then(function (data){
      //get the question and bind it to scope
    $scope.question = data;
      //add to the total view count
    $scope.question.totalViews++;
    $scope.updateQuestion($scope.question);
    answersFactory.getAnswers().then( function(answers) {

      var answersForQuestion = _.where(answers, { question: $scope.question.objectId });

      $scope.answers = answersForQuestion;
    });

    //hide buttons if User is not logged in and if not the author of the question
    if(Parse.User.current() != undefined) {



      if(Parse.User.current().id === $scope.question.user) {

        $('#editQuestion').show();
        $('#deleteQuestion').show();
      }

      else {
        $('#editQuestion').hide();
        $('#deleteQuestion').hide();
      }

    }
    else {
      $('#answerQuestion').hide();
      $('#editQuestion').hide();
      $('#deleteQuestion').hide();
    }

  });




  $scope.updateQuestion = function (question) {

    questionsFactory.updateQuestion(question);

    $rootScope.$on('question:updated', function (){
      $location.path('question/' + $routeParams.id);
    });

  }

  $scope.deleteQuestion = function (question) {
    questionsFactory.deleteQuestion(question);

    $rootScope.$on('question:deleted', function (){
      $location.path('/');
    });

  }

  $scope.addAnswer = function (answer) {
    var user = Parse.User.current();
    answer.authorName = user.attributes.username;
    answer.user = user.id;
    answer.questionText = $scope.question.text;
    answer.question = $scope.question.objectId;
    answer.votes = 0;
    answer.isAnswer = false;
    answersFactory.addAnswer(answer);
    $scope.$apply();
  }

  $scope.voteUp = function (answer) {
    answer.votes++;
    answersFactory.updateAnswer(answer);
  }

  $scope.voteDown = function (answer) {
    answer.votes--;
    answersFactory.updateAnswer(answer);
  }

  $scope.isAnswer = function (answer) {
    answer.isAnswer = true;
    answersFactory.updateAnswer(answer);
  }


    }]);



}());
