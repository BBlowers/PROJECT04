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