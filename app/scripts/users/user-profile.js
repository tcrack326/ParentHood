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
