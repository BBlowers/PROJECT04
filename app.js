var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bluebird = require('bluebird');
var bodyParser = require('body-parser');
var routes = require('./config/routes');
var socketioJwt = require('socketio-jwt');
var secret = require('./config/tokens').secret;
var port = process.env.PORT || 3000;
var environment = app.get('env');
var databaseUri = require('./config/db.js')(environment)
var User = require('./models/user.js')
var Conversation = require('./models/conversation.js')

mongoose.Promise = bluebird;
mongoose.connect(databaseUri);

if('test' !== environment) {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/api', routes);

server = app.listen(port, function() {
  console.log("Express is listening on port: " + port);
});

function compareArrays(foo, bar) {
  for (var i = 0; i < foo.length; i++) {
    if (bar.indexOf(foo[i]) > -1) {
      return foo[i];
    }
  }
}

function updateUserConversations(sender, reciever, message, callback) {
  var matchedConversationId = false;
  User.find({ username: reciever })
    .then(function(users) {
      return users[0];
    })
    .then(function(reciever) {
      User.find({ username: sender })
        .then(function(users) {
          return { sender: users[0], reciever: reciever};
        })
        .then(function(users) {
          matchedConversationId = compareArrays(users.sender.conversations, users.reciever.conversations);
          if(!!matchedConversationId) {
            Conversation.find({ _id: matchedConversationId })
              .then(function(conversations) {
                conversations[0].messages.push({ sender: sender, messageContents: message });
                conversations[0].save();
              })
          } else {
            Conversation.create({ users: [sender, reciever.username], messages: [{ sender: sender, messageContents: message }] })
              .then(function(conversation) {
                return conversation.save();
              })
              .then(function(conversation) {
                matchedConversationId = conversation._id;
                users.sender.conversations.push(conversation._id);
                users.reciever.conversations.push(conversation._id);
                return { sender: users.sender, reciever: users.reciever };
              })
              .then(function(users) {
                users.sender.save();
                users.reciever.save();
              })
          }
        })
        .then(function(conversationId) {
          return callback(matchedConversationId);
        })
    })
}


var io = require('socket.io').listen(server);
var users = {};

io.on('connection', socketioJwt.authorize({
  secret: secret,
  timeout: 2000
})).on('authenticated', function(socket) {
  users[socket.decoded_token.username] = socket;

  socket.on('message', function(data) {
    io.sockets.emit('message', data);
  });

  socket.on('pm', function(data) {
    if (data.sender !== data.reciever) {
      updateUserConversations(data.sender, data.reciever, data.message, function(conversationId) {
        data.conversationId = conversationId;
        socket.emit('pm', data);
        if (!!users[data.reciever]) users[data.reciever].emit('pm', data);
      })  
    }
  });

  socket.on('disconnect', function() {
    delete users[socket.decoded_token.username];
  });
});

module.exports = app;