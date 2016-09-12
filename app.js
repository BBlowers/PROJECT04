var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bluebird = require('bluebird');
var bodyParser = require('body-parser');
var routes = require('./config/routes')
var port = process.env.PORT || 3000;
var environment = app.get('env');
var databaseUri = require('./config/db.js')(environment)

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

var io = require('socket.io').listen(server);

// io.on('connection', function(socket) {
//   console.log('connected to socket with id: ' + socket.id);

//   socket.on('message', function(message) {
//     console.log("message is: ", message);
//     //to yourself
//     socket.emit('message', message);
//     //to everyone else
//     socket.broadcast.emit('message', message);
//     //to everyone including yourself
//     io.sockets.emit('message', message);
//   });
// });

module.exports = app;