angular
  .module('RetroGames')
  .controller("RoomsNewController", RoomsNewController);

RoomsNewController.$inject = ["Room", "$state", "$auth"];
function RoomsNewController(Room, $state, $auth) {
  var self = this;
  this.new = {};

  this.currentUser = $auth.getPayload();

  this.create = function() {
    this.new.users = [this.currentUser._id];
    Room.save(this.new, function() {
      $state.go('roomsIndex');
    });
  }
}