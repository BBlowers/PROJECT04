angular
  .module('RetroGames')
  .controller("GamePostsShowController", GamePostsShowController);

GamePostsShowController.$inject = ["GamePost", "$state", "$scope", "$rootScope"];
function GamePostsShowController(GamePost, $state, $scope, $rootScope) {
  this.selected = GamePost.get($state.params, function(gamePost) {
    $rootScope.$broadcast("gameSelected");
  });

  this.delete = function() {
    this.selected.$remove(function() {
      $state.go("gamePostsIndex");
    });
  }

}