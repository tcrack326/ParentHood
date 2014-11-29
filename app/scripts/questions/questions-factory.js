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
