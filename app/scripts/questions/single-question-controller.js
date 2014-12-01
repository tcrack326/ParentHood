(function () {

  angular.module('ParentHood')
    .controller('SingleQuestionController', ['questionsFactory', 'usersFactory', '$scope', '$routeParams', '$rootScope', '$location', function (questionsFactory, usersFactory, $scope, $routeParams, $rootScope, $location) {

    usersFactory.checkUser();
    $scope.logOutUser = function () {
      usersFactory.logOutUser();
    };

    questionsFactory.getQuestion($routeParams.id).then(function (data){

    $scope.question = data;
    if(Parse.User.current().id === $scope.question.user){
      $('#editQuestion').show();
      $('#deleteQuestion').show();
    }
    else {
      $('#editQuestion').hide();
      $('#deleteQuestion').hide();
    }

  });




  $scope.updateQuestion = function (question) {

    questionsFactory.updateQuestion(question);

    $rootScope.$on('question:updated', function (){
      $location.path('/');
    });

  }

  $scope.deleteQuestion = function (question) {
    questionsFactory.deleteQuestion(question);

    $rootScope.$on('question:deleted', function (){
      $location.path('/');
    });

  }

    }]);

}());
