angular
  .module("RetroGames")
  .controller("MainController", MainController);

MainController.$inject = ["$window", "$auth", "$state", "$rootScope"];
function MainController($window, $auth, $state, $rootScope) {
  var self = this;

  var socket = $window.io();

  this.connected = false;

  this.privateUser = null;

  this.selectPrivateUser = function(username) {
    this.privateUser = { username: username };
  }

  socket.on('connect', function() {
    socket
      .emit('authenticate', { token: $auth.getToken() })
      .on('authenticated', function() {
        $rootScope.$applyAsync(function() {
          self.connected = true;
        });
      })
      .on('unauthorized', function() {
        $rootScope.$applyAsync(function() {
          self.connected = false;
        });
      });

    socket.on('disconnect', function(){
      $rootScope.$applyAsync(function() {
        self.connected = false;
      });
    });
  });

  this.message = null;

  this.all = [];

  this.sendMessage = function() {
    socket.emit("pm", { message: this.message, reciever: this.privateUser.username, sender: this.currentUser.username });
    this.message = null;
  }

  socket.on('pm', function(message) {
    console.log('pm', message);
    $rootScope.$evalAsync(function() {
      self.all.push(message);
    });
  });

  this.currentUser = $auth.getPayload();

  this.logout = function() {
    $auth.logout();
    this.currentUser = null;
    $state.go("filmsIndex");
  }

  $rootScope.$on("loggedIn", function() {
    self.currentUser = $auth.getPayload();
  });
}
