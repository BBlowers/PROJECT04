var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var platformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
  gamePosts: { type: mongoose.Schema.ObjectId, ref: 'GamePost' }
});

module.exports = mongoose.model('Platform', platformSchema);