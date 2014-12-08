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
