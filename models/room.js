var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  messages: [],
  users: []
});

module.exports = mongoose.model('Room', roomSchema);