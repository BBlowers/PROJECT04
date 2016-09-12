var Platform = require('../models/platform');

function platformIndex(req, res) {
  Platform.find()
    .populate('GamePost')
    .then(function(platforms) {
      res.status(200).json(platforms)
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

module.exports = platformIndex;
