Parse.initialize("cu3uLycT23GMhmWTRCAuEgM1I44LVHvdft4YL3ps", "SsEF54biIRFKzfscDlupAmCHAJJ7iQGQaWCHmsRE");

var logOutUser = function() {
  Parse.User.logOut();
};


(function (){

  $(document).foundation();

  var app = angular.module('ParentHood', ['ngRoute', 'restangular']);

  app.config( function ($routeProvider, RestangularProvider) {

    RestangularProvider.setBaseUrl('https://api.parse.com/1/');
    RestangularProvider.setRestangularFields({
      id: 'objectId'
    });

    // set default header for Parse backend
    RestangularProvider.setDefaultHeaders({
      'X-Parse-Application-Id': 'cu3uLycT23GMhmWTRCAuEgM1I44LVHvdft4YL3ps', 'X-Parse-REST-API-Key': '3P5mOsEqFzJ0oEZpDtr36UnGwszbPVqwy7b2BYXh', 'Content-Type': 'application/json'
      });

      //define where the data is located in the response based on the operation
      RestangularProvider.setResponseExtractor(function(response, operation) {
        if (operation === 'getList'){

          return response.results;
        }

        else {

          return response;
        }

    });

    $routeProvider.when('/login', {
      templateUrl: 'templates/login.html',
      controller: 'LoginUserController'
    });

    $routeProvider.when('/signup', {
      templateUrl: 'templates/signup.html',
      controller: 'LoginUserController'
    });

    $routeProvider.when('/', {
      templateUrl: 'templates/main.html',
      controller: 'QuestionsController'
    });

    $routeProvider.when('/question/:id', {
      templateUrl: 'templates/singleQuestion.html',
      controller: 'SingleQuestionController'
    });

    $routeProvider.when('/editQuestion/:id', {
      templateUrl: 'templates/editQuestion.html',
      controller: 'SingleQuestionController'
    });

    $routeProvider.when('/add', {
      templateUrl: 'templates/add.html',
      controller: 'AddQuestionController'
    });

    $routeProvider.when('/tags/:searchText', {
      templateUrl: 'templates/main.html',
      controller: 'QuestionsController'
    });

    $routeProvider.when('/parent/:id', {
      templateUrl: 'templates/user-profile.html',
      controller: 'ProfileUserController'
    });

  });


  // app.directive('logout', function (){
  //
  //   return {
  //     link: function ($scope, element, attrs) {
  //
  //       element.bind('click', function () {
  //         Parse.User.logOut();
  //       });
  //     }
  //   }
  //});



}());

(function () {

  angular.module('ParentHood')
  .factory('questionsFactory', ['$rootScope', 'Restangular', function ($rootScope, Restangular) {

  //defines the endpoint where Restangular gets the data - url defined in app.config with Restangular provider
  var allQuestions = Restangular.all('classes/questions');

  function getQuestions () {
    //retrieves (gets the data) from the REST endpoint
    return allQuestions.getList();

  }

  function getQuestion (id) {
    //gets a single question from the server based on id
    return allQuestions.get(id);

  }

  function addQuestion (question) {

    allQuestions.post(question).then( function (){
      //broadcast to the parent controller that the question has been added and redirect in the controller
      $rootScope.$broadcast('question:added');
    });
  }

  function updateQuestion (question) {
  question.put().then( function (){
      //broadcast to the parent controller that the chore has been updated and redirect in the controller
      $rootScope.$broadcast('question:updated');
    });
  }

  function deleteQuestion (question) {

  question.remove().then( function (){
      //broadcast to the parent controller that the chore has been updated and redirect in the controller
      $rootScope.$broadcast('question:deleted');
    });
  }

  return {

        getQuestions: getQuestions,
        getQuestion: getQuestion,
        addQuestion: addQuestion,
        updateQuestion: updateQuestion,
        deleteQuestion: deleteQuestion

      };

  }]);

}());

(function () {

  angular.module('ParentHood')
  .factory('usersFactory', ['$rootScope', '$http', 'Restangular', function ($rootScope, $http, Restangular) {

  //defines the endpoint where Restangular gets the data - url defined in app.config with Restangular provider
  var allUsers = Restangular.all('users');
  var PARSE_HEADERS = {
    'X-Parse-Application-Id': 'cu3uLycT23GMhmWTRCAuEgM1I44LVHvdft4YL3ps', 'X-Parse-REST-API-Key': '3P5mOsEqFzJ0oEZpDtr36UnGwszbPVqwy7b2BYXh', 'Content-Type': 'application/json'
  };

  var url = 'https://api.parse.com/1/login?';

  function loginUser (user) {

      Parse.User.logIn(user.username, user.password, {
        success: function(user) {
          // Do stuff after successful login.
          $rootScope.$broadcast('user:loggedIn');
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        alert('log in failed' + error);
      }
    });
  }

  function getUser (id) {
    //gets a single user from the server based on id
    return allUsers.get(id);

  }


  function checkUser() {

    if(Parse.User.current()){

      $('.login').html("<li><a href='#'><span class='headerIcon icon-home'></span>Home</a></li><li><a href='#/parent/"+ Parse.User.current().id+"'><span class='icon-profile'></span>My Profile</a></li><li><a href='' onClick='logOutUser()'><span class='icon-exit'></span>Logout</a></li>");

    }

    else {

      $('.login').html("<li><a href='#'><span class='headerIcon icon-home'></span>Home</a></li><li><a href='#/login'><span class='icon-enter'></span>Login</a></li><li><a href='#/signup'><span class='icon-pencil'></span>Sign Up</a></li>");

    }
  }

  // function logOutUser() {
  //   console.log('log out');
  //   Parse.User.logOut();
  // }

  function addNewUser (user) {

    allUsers.post(user).then( function (){
      //broadcast to the parent controller that the user has been added and redirect in the controller
      Parse.User.logIn(user.username,user.password).then( function (){
        $rootScope.$broadcast('user:loggedIn');
      });
    });
  }



  return {
        loginUser: loginUser,
        getUser: getUser,
        checkUser: checkUser,
        addNewUser: addNewUser
      };

  }]);

}());

(function () {

  angular.module('ParentHood')
  .factory('userStatsFactory', ['$rootScope', '$http', 'Restangular', function ($rootScope, $http, Restangular) {

  //defines the endpoint where Restangular gets the data - url defined in app.config with Restangular provider
  var allUserStats = Restangular.all('classes/userStats');

  function getUserStats () {
    //retrieves (gets the data) from the REST endpoint

    return allUserStats.getList();

  }

  function getUserStats (id) {
    return allUserStats.getList( { where: {userId: id } } );

  }

  function addNewUserStats (user) {
    var userStats={};
    userStats.userId = user.id;
    userStats.imageURL = "images/defaultUser.jpg";
    userStats.questionsAsked = 0;
    userStats.answersPosted = 0;
    userStats.yearsParenting = 0;
    userStats.numberOfChildren = 0;
    userStats.description = "";
    userStats.correctAnswers = 0;
    userStats.votesMade = 0;
    userStats.badges = [];
    allUserStats.post(userStats).then( function (){
      $rootScope.$broadcast('userStats:added');
    });
  }

  function updateUserStats (userStats) {
    userStats.put().then( function (){
      //broadcast to the parent controller that the stats have been updated and redirect in the controller
      $rootScope.$broadcast('userStats:updated');
    });
  }

  return {
        getUserStats: getUserStats,
        updateUserStats: updateUserStats,
        addNewUserStats: addNewUserStats
      };

  }]);

}());

(function () {

  angular.module('ParentHood')
  .factory('answersFactory', ['$rootScope', 'Restangular', function ($rootScope, Restangular) {

  //defines the endpoint where Restangular gets the data - url defined in app.config with Restangular provider
  var allAnswers = Restangular.all('classes/answers');

  function getAnswers () {
    //retrieves (gets the data) from the REST endpoint

    return allAnswers.getList();

  }

  function getAnswer (id) {
    //gets a single question from the server based on id
    return allAnswers.get(id);

  }

  function addAnswer (answer) {

    allAnswers.post(answer).then( function (){
      //broadcast to the parent controller that the answer has been added and redirect in the controller
      $rootScope.$broadcast('answer:added');
    });
  }

  function updateAnswer (answer) {
  answer.put().then( function (){
      //broadcast to the parent controller that the answer has been updated and redirect in the controller
      $rootScope.$broadcast('answer:updated');
    });
  }

  function deleteAnswer (answer) {

  answer.remove().then( function (){
      //broadcast to the parent controller that the answer has been deleted and redirect in the controller
      $rootScope.$broadcast('answer:deleted');
    });
  }

  return {

        getAnswers: getAnswers,
        getAnswer: getAnswer,
        addAnswer: addAnswer,
        updateAnswer: updateAnswer,
        deleteAnswer: deleteAnswer

      };

  }]);

}());

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

(function () {

angular.module('ParentHood')
  .controller('QuestionsController', ['questionsFactory', 'usersFactory', '$scope', '$rootScope', '$location', '$filter', '$routeParams', function (questionsFactory, usersFactory, $scope, $rootScope, $location, $filter, $routeParams) {

  usersFactory.checkUser();
  $scope.reverse = false;

  $('#navModal').foundation('reveal', 'close');

  if(Parse.User.current()){
    $scope.user = Parse.User.current();
    $scope.username = Parse.User.current().attributes.username;
  }

  questionsFactory.getQuestions().then( function (data) {
    $scope.questions = data;
    $scope.order('-createdAt',false);
  });

  //set up the sorting with $filter
  var orderBy = $filter('orderBy');
  //sort the answers
  $scope.order = function(predicate, reverse) {
    $scope.questions = orderBy($scope.questions, predicate, reverse);
  };

  $scope.doSearch = function () {
    $scope.searchText = this.tag;
  };

  $scope.doTagSearch = function () {
    $scope.searchText = $routeParams.searchText;
  };

  $scope.doTagSearch();

  $scope.checkUser = function () {
    if($scope.user){
      return true;
    }
    else {
      return false;
    }
  }

  if(Parse.User.current()){
    $('#askQuestion').show();
  }
  else {
    $('#askQuestion').hide();
  }

  }]);

}());

(function () {

  angular.module('ParentHood')
    .controller('LoginUserController', ['usersFactory', 'userStatsFactory', '$scope', '$rootScope', '$location', '$routeParams', function (usersFactory, userStatsFactory, $scope, $rootScope, $location, $routeParams) {

  //close modal if navigated from there
  $('#navModal').foundation('reveal', 'close');

  usersFactory.checkUser();

  $scope.addNewUser = function (user) {
            usersFactory.addNewUser(user);
            //$scope.loginUser(user);

            $rootScope.$on('user:loggedIn', function () {
              userStatsFactory.addNewUserStats(Parse.User.current());
              $location.path('/');
            });
  }

  $scope.loginUser = function (user) {
            usersFactory.loginUser(user);

            $rootScope.$on('user:loggedIn', function () {
              $location.path('/');
            });
  }

    }]);

}());

(function () {

  angular.module('ParentHood')
    .controller('ProfileUserController', ['usersFactory', 'userStatsFactory', '$scope', '$rootScope', '$location', '$routeParams', function (usersFactory, userStatsFactory, $scope, $rootScope, $location, $routeParams) {

    $('#navModal').foundation('reveal', 'close');
    $scope.isEditing = false;

    usersFactory.getUser($routeParams.id).then( function(data) {
      $scope.user = data;
    });
    userStatsFactory.getUserStats($routeParams.id).then( function(data) {
      $scope.userStats = data[0];
    });

    $scope.beginEditing = function () {
      $scope.isEditing = true;
    }

    $scope.updateUserStats = function (userStats) {

      userStatsFactory.updateUserStats(userStats);

      $rootScope.$on('userStats:updated', function (){
        $location.path('/');
      });

    }

    $scope.userAuth = function () {

        if (Parse.User.current() != undefined) {
          if (Parse.User.current().id === $scope.user.objectId) {
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



    }]);

}());
