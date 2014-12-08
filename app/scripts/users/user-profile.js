(function () {

  angular.module('ParentHood')
    .controller('ProfileUserController', ['usersFactory', 'userStatsFactory', '$scope', '$rootScope', '$location', '$routeParams', function (usersFactory, userStatsFactory, $scope, $rootScope, $location, $routeParams) {

    $('#navModal').foundation('reveal', 'close');

    usersFactory.getUser($routeParams.id).then( function(data) {
      $scope.user = data;
    });
    userStatsFactory.getUserStats($routeParams.id).then( function(data) {
      $scope.userStats = data[0];
    });


    }]);

}());
