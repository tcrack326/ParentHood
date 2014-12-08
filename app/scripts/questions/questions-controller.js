(function () {

angular.module('ParentHood')
  .controller('QuestionsController', ['questionsFactory', 'usersFactory', '$scope', '$rootScope', '$location', '$filter', '$routeParams', function (questionsFactory, usersFactory, $scope, $rootScope, $location, $filter, $routeParams) {

  usersFactory.checkUser();

  $('#navModal').foundation('reveal', 'close');

  if(Parse.User.current()){
    $scope.user = Parse.User.current();
    $scope.username = Parse.User.current().attributes.username;
  }

  questionsFactory.getQuestions().then( function (data) {
    $scope.questions = data;
    $scope.order('-totalViews',false);
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


  $scope.logOutUser = function () {
    console.log('something');
    usersFactory.logOutUser();
    usersFactory.checkUser();
  };

  if(Parse.User.current()){
    $('#askQuestion').show();
  }
  else {
    $('#askQuestion').hide();
  }

  }]);

}());
