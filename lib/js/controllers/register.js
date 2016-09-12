angular
  .module("RetroGames")
  .controller("RegisterController", RegisterController);

RegisterController.$inject = ["$auth", "$state", "$rootScope"];
function RegisterController($auth, $state, $rootScope) {

  this.newUser = {};

  this.submit = function() {
    $auth.signup(this.newUser, {
      url: '/api/register'
    })
    .then(function(){
      $rootScope.$broadcast("loggedIn");
      $state.go("login");
    })
  }
}