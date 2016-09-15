angular
  .module("RetroGames")
  .controller("MainController", MainController);

MainController.$inject = ["$window", "$auth", "$state", "$rootScope", "User"];
function MainController($window, $auth, $state, $rootScope, User) {
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

  // ----------------------------------------- should try using this.chatWindows[idOfChatWindow].title
  // ----------------------------------------- should try using this.chatWindows[idOfChatWindow].messages

  this.all = [];

  this.sendMessage = function(users) {
    var privateUser = this.chatWindowName(users);
    socket.emit("pm", { message: this.message, reciever: privateUser, sender: this.currentUser.username });
    // socket.emit("pm", { message: this.message, reciever: this.privateUser.username, sender: this.currentUser.username });
    this.message = null;
  }

  socket.on('pm', function(message) {
    console.log('pm', message);
    $rootScope.$evalAsync(function() {
      var matchedConversation = null;
      self.conversations.forEach(function(conversation) {
        if (conversation._id === message.conversationId) matchedConversation = conversation;
      })
      if(!!matchedConversation) {
        matchedConversation.messages.push({ sender: message.sender, messageContents: message.message })
      }

      // self.all.push(message);
    });
  });

  this.currentUser = $auth.getPayload();

  if (!!self.currentUser) {
    console.log(self.currentUser._id);
    User.get({ id: self.currentUser._id }, function(user) {
      self.conversations = user.conversations;
    })  
  } 

  this.chatWindowName = function(users) {
    var chatName;
    users.forEach(function(user) {
      if (user !== self.currentUser.username) {
       chatName = user;
      }
    });
    return chatName;
  }

  this.logout = function() {
    $auth.logout();
    this.currentUser = null;
    this.conversations = null;
    $state.go("home");
  }

  $rootScope.$on("loggedIn", function() {
    self.currentUser = $auth.getPayload();
    User.get({ id: self.currentUser._id }, function(user) {
      self.conversations = user.conversations;
    })  
  });
}
