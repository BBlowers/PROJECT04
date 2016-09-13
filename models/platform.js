var mongoose = require('mongoose');

var platformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
  gamePosts: { type: mongoose.Schema.ObjectId, ref: 'GamePost' }
});

module.exports = mongoose.model('Platform', platformSchema);