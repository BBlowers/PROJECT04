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