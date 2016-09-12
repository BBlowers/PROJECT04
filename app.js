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

app.listen(port, function() {
  console.log("Express is listening on port: " + port);
});

module.exports = app;