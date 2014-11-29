(function () {

  angular.module('ParentHood')
    .controller('LoginUserController', ['usersFactory', '$scope', '$rootScope', '$location', function (usersFactory, $scope, $rootScope, $location) {


  $scope.addNewUser = function (user) {
            usersFactory.addNewUser(user);

            $rootScope.$on('user:added', function () {
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
