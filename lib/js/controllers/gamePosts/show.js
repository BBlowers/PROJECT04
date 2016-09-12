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