(function () {

  angular.module('ParentHood')
    .controller('LoginUserController', ['usersFactory', 'userStatsFactory', '$scope', '$rootScope', '$location', '$routeParams', function (usersFactory, userStatsFactory, $scope, $rootScope, $location, $routeParams) {


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
