var router = require('express').Router();

var authController = require('../controllers/auth');
var gamePostsController = require('../controllers/gamePosts');
var genresController = require('../controllers/genres');
var platformsController = require('../controllers/platforms');
var usersController = require('../controllers/users');

var jwt = require('jsonwebtoken');
var secret = require('./tokens').secret;

var upload = require('./upload');

function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: "Unauthorized" });

  var token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, function(err, payload) {
    if(err || !payload) return res.status(401).json({ message: "Unauthorized" });

    req.user = payload;
    next();
  });
}

router.post('/login', authController.login);
router.post('/register', authController.register);

router.route('/genres')
  .get(genresController);

router.route('/platforms')
  .get(platformsController);

router.route('/game_posts')
  .get(gamePostsController.index)
  .post(upload.array('pictures'), gamePostsController.create);

router.route('/game_posts/:id')
  .get(gamePostsController.show)
  .delete(gamePostsController.delete)
  .put(upload.array('pictures'),
    gamePostsController.update);

router.route('/users')
  .get(usersController.index)
  .post(usersController.create);

router.route('/users/:id')
  .get(usersController.show)
  .delete(usersController.delete)
  .put(usersController.update);

module.exports = router;