var GamePost = require('../models/gamePost');

function gamePostIndex(req, res) {
  GamePost.find()
    .populate('owner platform genres')
    .then(function(gamePosts) {
      res.status(200).json(gamePosts)
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

function gamePostShow(req, res) {
  GamePost.findById(req.params.id)
    .populate('owner platform genres')
    .then(function(gamePost) {
      res.status(200).json(gamePost);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function gamePostCreate(req, res) {

  req.body.pictures = Object.keys(req.files).map(function(key) {
    return req.files[key].key;
  });

  GamePost.create(req.body)
    .then(function(gamePost) {
      return GamePost.findById(gamePost._id)
        .populate('owner platform genres');
    })
    .then(function(gamePost) {
      res.status(201).json(gamePost);
    })
    .catch(function(err) {
      console.log("err: ", err);
      res.status(500).json(err);
    });
}

function gamePostUpdate(req, res) {
  console.log("req.body: ", req.body);
  req.body.pictures = req.body.pictures.toString().split(",").concat(Object.keys(req.files).map(function(key) {
    return req.files[key].key;
  }));

  GamePost.findById(req.params.id)
    .then(function(gamePost) {
      for(key in req.body) gamePost[key] = req.body[key];
      return gamePost.save();
    })
    .then(function(gamePost) {
      return GamePost.findById(gamePost._id)
        .populate('User Platform Genre');
    })
    .then(function(gamePost) {
      res.status(200).json(gamePost);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

function gamePostDelete(req, res) {
  GamePost.findById(req.params.id)
    .then(function(gamePost) {
      return gamePost.remove();
    })
    .then(function() {
      res.status(204).end();
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

module.exports = {
  index: gamePostIndex,
  show: gamePostShow,
  create: gamePostCreate,
  update: gamePostUpdate,
  delete: gamePostDelete
}
