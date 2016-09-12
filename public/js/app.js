angular
  .module('RetroGames', ["ngResource", "ui.router", "satellizer"])
  .config(Router);

Router.$inject = ["$stateProvider", "$urlRouterProvider"];
function Router($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: "LoginController as login"
    })
    .state('register', {
      url: '/register',
      templateUrl: '/templates/register.html',
      controller: "RegisterController as register"
    })
    .state('home', {
      url: '/',
      templateUrl: '/templates/home.html',
      controller: 'MainController as main'
    })
    .state('gamePostsIndex', {
      url: '/game_posts',
      templateUrl: '/templates/gamePosts/index.html',
      controller: 'GamePostsIndexController as gamePostsIndex'
    })
    .state('gamePostsNew', {
      url: '/game_posts/new',
      templateUrl: '/templates/gamePosts/new.html',
      controller: 'GamePostsNewController as gamePostsNew'
    })
    .state('gamePostsShow', {
      url: '/game_posts/:id',
      templateUrl: '/templates/gamePosts/show.html',
      controller: 'GamePostsShowController as gamePostsShow'
    })
    .state('gamePostsEdit', {
      url: '/game_posts/:id/edit',
      templateUrl: '/templates/gamePosts/edit.html',
      controller: 'GamePostsEditController as gamePostsEdit'
    });

  $urlRouterProvider.otherwise("/");

}
angular
  .module("RetroGames")
  .controller("LoginController", LoginController);

LoginController.$inject = ["$auth", "$state", "$rootScope"];
function LoginController($auth, $state, $rootScope) {

  this.credentials = {};

  this.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function() {
        $rootScope.$broadcast("loggedIn");
        $state.go('home');
      });
  }

  this.submit = function() {
    $auth.login(this.credentials, {
      url: "/api/login"
    }).then(function(){
      $rootScope.$broadcast("loggedIn");
      $state.go('home');
    })
  }
}
angular
  .module("RetroGames")
  .controller("MainController", MainController);

MainController.$inject = ["$auth", "$state", "$rootScope"];
function MainController($auth, $state, $rootScope) {
  var self = this;

  this.currentUser = $auth.getPayload();

  this.logout = function() {
    $auth.logout();
    self.currentUser = null;
    $state.go("home");
  }

  $rootScope.$on("loggedIn", function() {
    self.currentUser = $auth.getPayload();
  });
}

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
angular
  .module("RetroGames")
  .factory("GamePost", GamePost);

GamePost.$inject = ["$resource"];
function GamePost($resource) {
  return $resource('/api/game_posts/:id', { id: '@_id' },  {
    update: {
      method: "PUT"
    }
  });
}
angular
  .module("RetroGames")
  .factory("Genre", Genre);

Genre.$inject = ["$resource"];
function Genre($resource) {
  return $resource('/api/genres/:id', { id: '@_id' },  {
    update: {
      method: "PUT"
    }
  });
}
angular
  .module("RetroGames")
  .factory("Platform", Platform);

Platform.$inject = ["$resource"];
function Platform($resource) {
  return $resource('/api/platforms/:id', { id: '@_id' },  {
    update: {
      method: "PUT"
    }
  });
}
angular
  .module("RetroGames")
  .factory("User", User);

User.$inject = ["$resource"];
function User($resource) {
  return $resource('/api/users/:id', { id: '@_id' },  {
    update: {
      method: "PUT"
    }
  });
}
angular
  .module('RetroGames')
  .controller("GamePostsEditController", GamePostsEditController);

GamePostsEditController.$inject = ["GamePost", "Platform", "Genre", "$state"];
function GamePostsEditController(GamePost, Platform, Genre, $state) {

  var self = this;
  self.selectedGenres = [];

  this.selected = GamePost.get($state.params, function(data) {
    self.selectedGenres = data.genres;
  });
  this.genres = Genre.query();
  this.platforms = Platform.query();

  this.removeGenre = function(genre) {
    console.log(this.selectedGenres, genre);
    this.selectedGenres.splice(
      this.selectedGenres.indexOf(genre), 1);
  }

  this.addGenre = function(genre) {
    for( var i = 0; i < self.selectedGenres.length; i++) {
      if(self.selectedGenres[i]._id === genre._id) return null;
    }

    self.selectedGenres.push(genre);
  }

  this.save = function() {
    this.selected.genres = this.selectedGenres;
    this.selected.$update(function() {
      $state.go('gamePostsShow', $state.params);
    });
  }
}
angular
  .module('RetroGames')
  .controller("GamePostsIndexController", GamePostsIndexController);

GamePostsIndexController.$inject = ["GamePost"];
function GamePostsIndexController(GamePost) {
  this.all = GamePost.query();
}
angular
  .module('RetroGames')
  .controller("GamePostsNewController", GamePostsNewController);

GamePostsNewController.$inject = ["GamePost","Platform", "Genre", "$state"];
function GamePostsNewController(GamePost, Platform, Genre, $state) {
  this.new = {};
  this.genres = Genre.query();
  this.platforms = Platform.query();

  this.create = function() {
    GamePost.save(this.new, function() {
      $state.go('filmsIndex');
    });
  }
}
angular
  .module('RetroGames')
  .controller("GamePostsShowController", GamePostsShowController);

GamePostsShowController.$inject = ["GamePost", "$state"];
function GamePostsShowController(GamePost, $state) {
  this.selected = GamePost.get($state.params);

  this.delete = function() {
    this.selected.$remove(function() {
      $state.go("gamePostsIndex");
    });
  }
}