var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var gamePostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  pictures: [{ type: String, required: true }], // needs to be changed to picture uploader thingy
  platform: { type: mongoose.Schema.ObjectId, ref: 'Platform' },
  genres: [{ type: mongoose.Schema.ObjectId, ref: 'Genre' }],
  releaseDate: Date
});


gamePostSchema.pre('save', function(next) {
  
  var doc = this;

  this.model('User')
    .findById(this.owner)
    .then(function(owner) {
      if(!!owner && owner.gamePosts.indexOf(doc._id) === -1) {
        owner.gamePosts.push(doc._id);
        return owner.save(next);
      }
      next();
    });
});

gamePostSchema.pre('remove', function(next) {
  
  var doc = this;

  this.model('User')
    .findById(this.owner)
    .then(function(owner) {
      var index = owner.gamePosts.indexOf(doc._id);
      if(index === -1) {
        owner.gamePosts.splice(index, 1);
        return owner.save(next);
      }
      next();
    });
});

module.exports = mongoose.model('GamePost', gamePostSchema);