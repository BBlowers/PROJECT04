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