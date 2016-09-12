var Genre = require('../models/genre');

function genreIndex(req, res) {
  Genre.find()
    .populate('GamePost')
    .then(function(genres) {
      res.status(200).json(genres)
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

module.exports = genreIndex;
