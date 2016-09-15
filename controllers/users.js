var User = require('../models/user');

function userIndex(req, res) {
  User.find()
    .populate('conversations')
    .then(function(users) {
      res.status(200).json(users)
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function userShow(req, res) {
  User.findById(req.params.id)
    .populate('conversations')
    .then(function(user) {
      res.status(200).json(user);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function userCreate(req, res) {
  User.create(req.body)
    .then(function(user) {
      return User.findById(user._id)
        .populate('conversations');
    })
    .then(function(user) {
      res.status(201).json(user);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function userUpdate(req, res) {
  User.findById(req.params.id)
    .then(function(user) {
      for(key in req.body) user[key] = req.body[key];
      return user.save();
    })
    .then(function(user) {
      res.status(200).json(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

function userDelete(req, res) {
  User.findById(req.params.id)
    .then(function(user) {
      return user.remove();
    })
    .then(function() {
      res.status(204).end();
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

module.exports = {
  index: userIndex,
  show: userShow,
  create: userCreate,
  update: userUpdate,
  delete: userDelete
}
