angular
  .module('RetroGames')
  .factory('formData', formData);

function formData() {
  return {
    transform: function(data) {
      console.log("data at start of formData", data);
      var formData = new FormData();
      angular.forEach(data, function(value, key) {
        if(!!value && value._id) value = value._id;
        if(!key.match(/^\$/)) {

          if(value instanceof FileList) {
            for(i=0;i<value.length;i++) {
              formData.append(key, value[i]);
            }
          } else {
            formData.append(key, value);
          }
        }
      });
      console.log("formData at end of formData", formData);
      return formData;
    }
  }
}