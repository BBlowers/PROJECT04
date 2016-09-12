angular
  .module("RetroGames")
  .factory("GamePost", GamePost);

GamePost.$inject = ["$resource", "formData"];
function GamePost($resource, formData) {
  return $resource('/api/game_posts/:id', { id: '@_id' },  {
    update: {
      method: "PUT",
      headers: { 'Content-Type': undefined },
      transformRequest: formData.transform
    },
    save: {
      method: "POST",
      headers: { 'Content-Type': undefined },
      transformRequest: formData.transform
    }
  });
}