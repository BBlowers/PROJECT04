angular
  .module('RetroGames')
  .controller("GamePostsIndexController", GamePostsIndexController);

GamePostsIndexController.$inject = ["GamePost"];
function GamePostsIndexController(GamePost) {
  this.all = GamePost.query();
}