(function () {

  angular.module('ParentHood')
    .controller('SingleQuestionController', ['questionsFactory', 'usersFactory', 'userStatsFactory', 'answersFactory', '$scope', '$routeParams', '$rootScope', '$location', '$timeout', '$filter', function (questionsFactory, usersFactory, userStatsFactory, answersFactory, $scope, $routeParams, $rootScope, $location, $timeout, $filter) {

    usersFactory.checkUser();

    $scope.logOutUser = function () {
      usersFactory.logOutUser();
    };




    questionsFactory.getQuestion($routeParams.id).then(function (data){
      //get the question and bind it to scope
      $scope.question = data;

      //add to the total view count
      if( _.contains($scope.question.hasViewed, Parse.User.current().id) ){
        //do nothing
      }
      else{
        $scope.question.totalViews++;
        $scope.question.hasViewed.push(Parse.User.current().id);
        $scope.updateQuestion($scope.question);
      }



      //get the answers to the question
      answersFactory.getAnswers().then( function (answers) {

        var answersForQuestion = _.where(answers, { question: $scope.question.objectId });

          $scope.answers = answersForQuestion;

          //set up the sorting with $filter
          var orderBy = $filter('orderBy');

          //sort the answers
          $scope.order = function(predicate, reverse) {
            $scope.answers = orderBy($scope.answers, predicate, reverse);
          };

          $scope.order('votes',false);

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

    userStatsFactory.getUserStats(user.id).then( function (data){
      var userStats = data[0];
      userStats.answersPosted++;
      userStatsFactory.updateUserStats(userStats);
    });

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
    question.totalVotes = question.totalVotes - Math.abs(answer.votes);

    $scope.updateQuestion(question);

    $rootScope.$on('answer:deleted', function () {
      $scope.answers = _.without($scope.answers, answer);
    });
  }

  $scope.voteUp = function (answer, question) {
    //need to add 2 if user has previously voted down and 1 otherwise
    if(_.contains(answer.hasVotedDown, Parse.User.current().id)){
      //add two
      answer.votes = answer.votes + 2;
    }
    else{
      //add one
      answer.votes++;
    }

    //check to see if user has voted before to update the total votes to the queston
    if( _.contains(answer.hasVotedUp, Parse.User.current().id) || _.contains(answer.hasVotedDown, Parse.User.current().id) ) {
      //do nothing
    }
    else {
      question.totalVotes++;
      questionsFactory.updateQuestion(question);
      userStatsFactory.getUserStats(Parse.User.current().id).then( function (data){
        var userStats = data[0];
        userStats.votesMade++;
        userStatsFactory.updateUserStats(userStats);
      });
    }
    answer.hasVotedUp.push(Parse.User.current().id);
    answer.hasVotedDown = _.without(answer.hasVotedDown,Parse.User.current().id);
    answersFactory.updateAnswer(answer);
    $scope.order('votes',false);
  }

  $scope.voteDown = function (answer, question) {
    //need to subtract 2 if user has voted up previously and 1 otherwise
    if( _.contains(answer.hasVotedUp, Parse.User.current().id) ){
      //subtract 2 from votes
      answer.votes = answer.votes - 2;
    }
    else{
      //subtract 1 from votes
      answer.votes--;
    }

    //check if user has voted before to either update the total votes to the question
    if( _.contains(answer.hasVotedUp, Parse.User.current().id) || _.contains(answer.hasVotedDown, Parse.User.current().id) ) {
      //do nothing - user cannot add to total votes more than once

    }
    else {
      //add to total votes
      question.totalVotes++;
      questionsFactory.updateQuestion(question);
      //update the user stats
      userStatsFactory.getUserStats(Parse.User.current().id).then( function (data){
        var userStats = data[0];
        userStats.votesMade++;
        userStatsFactory.updateUserStats(userStats);
      });
    }
    answer.hasVotedDown.push(Parse.User.current().id);
    answer.hasVotedUp = _.without(answer.hasVotedUp,Parse.User.current().id);
    answersFactory.updateAnswer(answer);
    $scope.order('votes',false);
  }

  $scope.isAnswer = function (answer,question) {
    _.each($scope.answers, function(thisAnswer){
      if(thisAnswer.isAnswer === true){
          thisAnswer.isAnswer = false;
          thisAnswer.votes = thisAnswer.votes - question.totalVotes;
          userStatsFactory.getUserStats(thisAnswer.user).then( function (data){
            var userStats = data[0];
            userStats.correctAnswers--;
            userStatsFactory.updateUserStats(userStats);
          });
      }
      thisAnswer.isAnswer = false;
      answersFactory.updateAnswer(thisAnswer);
    });

      answer.isAnswer = true;
      answer.votes = answer.votes + question.totalVotes;
      answersFactory.updateAnswer(answer);
      userStatsFactory.getUserStats(answer.user).then( function(data){
        var userStats = data[0];
        userStats.correctAnswers++;
        userStatsFactory.updateUserStats(userStats);
      });
      $scope.order('-votes',false);

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

  $scope.doSearch = function() {
    $scope.searchText = this.tag;
  };


    }]);



}());
