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

function findUserByUsernameAndUpdateConversation(username, counterpart, sender, message) {
  User.find({ username: username })
    .then(function(user) {
      conversationExists = user[0].conversations.map(function(conversation) {
        if (conversation.username === counterpart) {
          conversation.messages.push({ username: sender, messageContents: message })
          return true;
        } 
      }).includes(true);

      if (!conversationExists) user[0].conversations.push({ username: counterpart, messages: [{ username: sender, messageContents: message }] });
      user[0].save();
      console.log(user[0].username + "'s conversations are: ", user[0].conversations);    

      
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
    findUserByUsernameAndUpdateConversation(data.reciever, data.sender, data.sender, data.message);
    findUserByUsernameAndUpdateConversation(data.sender, data.reciever, data.sender, data.message);
    // User.find({ username: data.reciever })
    //   .then(function(user) {
    //     user[0].conversations.push({ username: data.sender, message: { username: data.sender, messageContents: data.message } })
    //     user[0].save();
    //     console.log("reciever.conversations is: ", user[0].conversations);
    //   })
    // User.find({ username: data.sender })
    //   .then(function(user) {
    //     user[0].conversations.push({ username: data.reciever, message: { username: data.sender, messageContents: data.message } })
    //     user[0].save();
    //     console.log("sender.conversations is: ", user[0].conversations);
    //   })
    users[data.reciever].emit('pm', data);
    socket.emit('pm', data);
  });

  socket.on('disconnect', function() {
    delete users[socket.decoded_token.username];
  });
});

module.exports = app;