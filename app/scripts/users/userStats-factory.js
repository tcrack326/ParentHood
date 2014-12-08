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
    userStats.imageURL = "";
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
