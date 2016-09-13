var Room = require('../models/room');

function roomIndex(req, res) {
  Room.find()
    .then(function(rooms) {
      res.status(200).json(rooms)
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function roomShow(req, res) {
  Room.findById(req.params.id)
    .then(function(room) {
      res.status(200).json(room);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function roomCreate(req, res) {
  Room.create(req.body)
    .then(function(room) {
      res.status(201).json(room);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function roomUpdate(req, res) {
  Room.findById(req.params.id)
    .then(function(room) {
      console.log("req.body.messages: ", req.body.messages);
      console.log("room.messages: ", room.messages);
      room.name = req.body.name;
      room.messages.concat(req.body.messages);
      // for(key in req.body) room[key] = req.body[key];
      console.log("room.messages: ", room.messages);
      return room.save();
    })
    .then(function(room) {
      res.status(200).json(room);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

function roomDelete(req, res) {
  Room.findById(req.params.id)
    .then(function(room) {
      return room.remove();
    })
    .then(function() {
      res.status(204).end();
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

module.exports = {
  index: roomIndex,
  show: roomShow,
  create: roomCreate,
  update: roomUpdate,
  delete: roomDelete
}
