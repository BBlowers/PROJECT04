var mongoose = require('mongoose');

var conversationSchema = new mongoose.Schema({
  messages: [],
  users: []
});

module.exports = mongoose.model('Conversation', conversationSchema);