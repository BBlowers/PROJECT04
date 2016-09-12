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