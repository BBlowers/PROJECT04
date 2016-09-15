var mongoose = require('mongoose');
var s3 = require('../config/s3');

var gamePostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  pictures: [{ type: String, required: true }],
  platform: { type: mongoose.Schema.ObjectId, ref: 'Platform' },
  genres: [{ type: mongoose.Schema.ObjectId, ref: 'Genre' }],
  releaseDate: Date
});

gamePostSchema.path('pictures')
  .get(function(pictures) {
    return pictures.map(function(picture) {
      return s3.endpoint.href + process.env.AWS_BUCKET_NAME + "/" + picture;
    });
  })
  .set(function(pictures) {
    return pictures.map(function(picture) {
      return picture.split('/').splice(-1)[0];
    });
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

gamePostSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('GamePost', gamePostSchema);