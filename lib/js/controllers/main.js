angular
  .module("RetroGames")
  .controller("MainController", MainController);

MainController.$inject = ["$window", "$auth", "$state", "$rootScope", "User"];
function MainController($window, $auth, $state, $rootScope, User) {
  var self = this;

  var socket = $window.io();

  this.connected = false;

  this.privateUser = null;

  this.startConversation = function(username) {
    self.currentUser = $auth.getPayload();
    if (username !== self.currentUser.username) {
      var matchedConversation = null;
      self.conversations.forEach(function(conversation) {
        if (conversation.users.includes(username)) matchedConversation = conversation;
      })
      if (!matchedConversation) {
        self.conversations.push({ currentMessage: null, messages: [], users: [username, self.currentUser.username], show: true })
      }  
    }    
  }

  this.isCurrentUserOwner = function(owner) {
    self.currentUser = $auth.getPayload();
    if (self.currentUser.username === owner) return true;
  }

  this.hideNavbar = function() {
    var hide = false;
    ["home", "login", "register"].forEach(function(stateName) {
      if($state.current.name === stateName) hide = true;
    })
    return hide;
  }
  
  this.addGamePostShow = function() {
    var hide = false;
    ["gamePostsIndex", "gamePostsShow", "gamePostsNew"].forEach(function(stateName) {
      if($state.current.name === stateName) hide = true;
    })
    return hide;
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

  this.sendMessage = function(conversation) {
    self.currentUser = $auth.getPayload();
    var privateUser = this.chatWindowName(conversation.users);
    socket.emit("pm", { message: conversation.currentMessage, receiver: privateUser, sender: self.currentUser.username });
    conversation.currentMessage = null;
  }

  socket.on('pm', function(message) {
    self.currentUser = $auth.getPayload();
    $rootScope.$evalAsync(function() {
      var matchedConversation = null;
      self.conversations.forEach(function(conversation) {
        var userMatches = 0;
        conversation.users.forEach(function(user) {
          message.users.forEach(function(messageUser) {
            if (messageUser === user) userMatches++;
          })
        })
        if (userMatches > 1) {
          matchedConversation = conversation;
        }        
      })
      if(!!matchedConversation) {
        matchedConversation.messages.push({ sender: message.sender, messageContents: message.message, show: true })
      } else {
        self.conversations.push({ currentMessage: null, messages: [{ sender: message.sender, messageContents: message.message }], users: [message.sender, self.currentUser.username], show: true })
      }
    });
  });

  self.currentUser = $auth.getPayload();

  if (!!self.currentUser) {
    User.get({ id: self.currentUser._id }, function(user) {
      self.conversations = user.conversations;
      self.conversations.forEach(function(conversation) {
        conversation.currentMessage = null;
        conversation.show = false;
      })
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

  this.showChat = function(conversation) {
    conversation.show = !conversation.show;
  }

  this.logout = function() {
    $auth.logout();
    self.currentUser = null;
    this.conversations = null;
    $state.go("home");
  }

  $rootScope.$on("loggedIn", function() {
    self.currentUser = $auth.getPayload();
    User.get({ id: self.currentUser._id }, function(user) {
      self.conversations = user.conversations;
      self.conversations.forEach(function(conversation) {
        conversation.currentMessage = null;
        conversation.show = false;
      })
    })  
  });
}
