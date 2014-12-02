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

      //get the answers to the question
      answersFactory.getAnswers().then( function (answers) {

        var answersForQuestion = _.where(answers, { question: $scope.question.objectId });

        $scope.answers = answersForQuestion;

        //hide the delete button if answer's author id is different than current user's
        _.each($scope.answers, function(answer){
          if (Parse.User.current() != undefined) {
            if (Parse.User.current().id === answer.user) {
              console.log(0);
              $('#'+ answer.objectId + '-' + answer.user).show();

            }
            else {
              console.log(1);
              $('#'+ answer.objectId + '-' + answer.user).hide();
            }
          }
          else {

            $('.deleteAnswer').hide();
            $('.voteUp').hide();
            $('.voteDown').hide();
            $('.isAnswer').hide();

          }
          $scope.$apply();
        });

      });


      //hide buttons if User is not logged in and if not the author of the question
      if (Parse.User.current() != undefined) {

        if (Parse.User.current().id === $scope.question.user) {
          $('#editQuestion').show();
          $('#deleteQuestion').show();
        }

        else {
          $('#editQuestion').hide();
          $('#deleteQuestion').hide();
        }

      }
      else {
        $('#answerArea').hide();
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

    $rootScope.$on('answer:added', function (){

      answersFactory.getAnswers().then( function (answers) {

        var answersForQuestion = _.where(answers, { question: $scope.question.objectId });

        $scope.answers = answersForQuestion;

      });

      //$scope.answers.push(answer);

      //$scope.$apply();
      $('#answerBox').val('');

    });

  }

  $scope.deleteAnswer = function (answer) {
    answersFactory.deleteAnswer(answer);

    $rootScope.$on('answer:deleted', function (){
      $scope.answers = _.without($scope.answers, answer);
    });
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
