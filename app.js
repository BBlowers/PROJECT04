var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;
var environment = app.get('env');
var databaseUri = require('./config/db.js')(environment)

app.listen(port, function() {
  console.log("Express is listening on port: " + port);
});

mongoose.connect(databaseUri);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));


module.exports = app;