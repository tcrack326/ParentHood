(function () {

  angular.module('ParentHood')
    .controller('SingleQuestionController', ['questionsFactory', 'usersFactory', 'answersFactory', '$scope', '$routeParams', '$rootScope', '$location', '$timeout', function (questionsFactory, usersFactory, answersFactory, $scope, $routeParams, $rootScope, $location, $timeout) {

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

        });

  });

  $scope.userAnswerAuth = function (answer) {

      if (Parse.User.current() != undefined) {
        if (Parse.User.current().id === answer.user) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }

  }

  $scope.userQuestionAuth = function (question) {
      if (Parse.User.current() != undefined) {
        if (Parse.User.current().id === question.user) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }

  }

  $scope.userVoteAuth = function () {

      if (Parse.User.current() != undefined) {

        return true;

      }

      else {

        return false;

      }

  }

  $scope.userAuth = function () {

      if (Parse.User.current() != undefined) {

        return true;

      }

      else {

        return false;

      }

  }

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
      //TODo - need to remove orphaned answers


    });

  }

  $scope.addAnswer = function (answer, question) {
    var user = Parse.User.current();
    answer.authorName = user.attributes.username;
    answer.user = user.id;
    answer.questionText = $scope.question.text;
    answer.question = $scope.question.objectId;
    answer.votes = 0;
    answer.isAnswer = false;
    answer.hasVotedUp = [];
    answer.hasVotedDown = [];
    answersFactory.addAnswer(answer);

    question.totalAnswers++;

    $scope.updateQuestion(question);

    $rootScope.$on('answer:added', function (){

        answersFactory.getAnswers().then( function (answers) {

          var answersForQuestion = _.where(answers, { question: $scope.question.objectId });

          $scope.answers = answersForQuestion;

      });

      $('#answerBox').val('');

    });

  }

  $scope.deleteAnswer = function (answer, question) {
    answersFactory.deleteAnswer(answer);

    question.totalAnswers--;

    $scope.updateQuestion(question);

    $rootScope.$on('answer:deleted', function (){
      $scope.answers = _.without($scope.answers, answer);
    });
  }

  $scope.voteUp = function (answer, question) {
    answer.votes++;
    answer.hasVotedUp.push(Parse.User.current().id);
    answer.hasVotedDown = _.without(answer.hasVotedDown,Parse.User.current().id);
    answersFactory.updateAnswer(answer);
    question.totalVotes++;
    questionsFactory.updateQuestion(question);
  }

  $scope.voteDown = function (answer, question) {
    answer.votes--;
    answer.hasVotedDown.push(Parse.User.current().id);
    answer.hasVotedUp = _.without(answer.hasVotedUp,Parse.User.current().id);
    answersFactory.updateAnswer(answer);
    questions.totalVotes++;
    questionsFactory.updateQuestion(question);
  }

  $scope.isAnswer = function (answer) {
    _.each($scope.answers, function(thisAnswer){
      thisAnswer.isAnswer = false;
      answersFactory.updateAnswer(thisAnswer);
    });

      answer.isAnswer = true;
      answersFactory.updateAnswer(answer);

  }

  $scope.checkIsAnswer = function (answer) {
    if (answer.isAnswer) {
      return true;
    }
    else {
      return false;
    }
  }

  $scope.hasVotedUp = function (answer) {
    if (_.contains(answer.hasVotedUp, Parse.User.current().id)){
      return true;
    }
    else {
      return false;
    }
  }

  $scope.hasVotedDown = function (answer) {
    if (_.contains(answer.hasVotedDown, Parse.User.current().id)){
      return true;
    }
    else{
      return false;
    }
  }


    }]);



}());
