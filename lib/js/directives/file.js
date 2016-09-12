angular
  .module('RetroGames')
  .directive('file', file);

function file() {
  return {
    restrict: 'A',
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {
      element.on('change', function(e) {
        if(element.prop('multiple')) {
          ngModel.$setViewValue(e.target.files);
        } else {
          ngModel.$setViewValue(e.target.files[0]);
        }
      });
    }
  }
}