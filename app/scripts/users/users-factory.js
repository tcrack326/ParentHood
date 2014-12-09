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

      $('.login').html("<li><a href='/'><span class='headerIcon icon-home'></span>Home</a></li><li><a href='#/parent/"+ Parse.User.current().id+"'><span class='icon-profile'></span>My Profile</a></li><li><a href='' onClick='logOutUser()'><span class='icon-exit'></span>Logout</a></li>");

    }

    else {

      $('.login').html("<li><a href='/'><span class='headerIcon icon-home'></span>Home</a></li><li><a href='#/login'><span class='icon-enter'></span>Login</a></li><li><a href='#/signup'><span class='icon-pencil'></span>Sign Up</a></li>");

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
