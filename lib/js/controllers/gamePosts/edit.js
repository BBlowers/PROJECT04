angular
  .module('RetroGames')
  .controller("GamePostsEditController", GamePostsEditController);

GamePostsEditController.$inject = ["GamePost", "Platform", "Genre", "$state"];
function GamePostsEditController(GamePost, Platform, Genre, $state) {

  var self = this;
  this.selectedGenres = [];

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
    this.selected.genres = this.selectedGenres.map(function(genre) {
      return genre._id;
    });
    this.selected.$update(function() {
      $state.go('gamePostsShow', $state.params);
    });
  }
}