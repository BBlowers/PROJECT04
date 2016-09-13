angular
  .module('RetroGames')
  .controller("RoomsShowController", RoomsShowController);

RoomsShowController.$inject = ["Room", "$state", "$auth", "$rootScope"];
function RoomsShowController(Room, $window, $state, $auth, $rootScope) {
  var self = this;

  // this.message = null;

  // this.allMessages = [];

  // this.roomId = $state.params._id;

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
    socket.emit("pm", { message: this.message, username: this.privateUser.username });
    this.message = null;
  }

  socket.on('pm', function(message) {
    console.log(message);
    $rootScope.$evalAsync(function() {
      self.all.push(message);
    });
  });  

  // var socket = io.connect();

  // socket.on('connection', function() {
  //   socket.emit('roomJoin', $state.params._id);  
  // })

  // this.sendMessage = function() {
  //   socket.emit("message", { message: this.message, roomId: self.roomId});
  //   this.message = null;
  // }

  // socket.on('message', function(message) {
  //   $rootScope.$evalAsync(function() {
  //     // console.log("message is: ", message);
  //     self.allMessages.push(message);
  //   })

  // })

  // this.selected = Room.get($state.params);

  // this.currentUser = $auth.getPayload();

  // this.messageContents = null;
  // this.newMessage = {};

  // // this.sendMessage = function() {
  // //   this.newMessage.username = this.currentUser.username;
  // //   this.newMessage.messageContents = this.messageContents;
  // //   this.selected.$update();
  // //   this.newMessage = {};
  // // }

  // this.delete = function() {
  //   this.selected.$remove(function() {
  //     $state.go("roomsShow");
  //   });
  // }
}