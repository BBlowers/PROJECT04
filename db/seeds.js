var mongoose = require('mongoose');
var GamePost = require('../models/gamePost');
var Genre = require('../models/genre');
var Platform = require('../models/platform');
var User = require('../models/user');
var bluebird = require('bluebird');

var databaseUri = require('../config/db')(process.env.NODE_ENV || "development");
mongoose.connect(databaseUri);
mongoose.Promise = bluebird;

GamePost.collection.drop();
Genre.collection.drop();
Platform.collection.drop();
User.collection.drop();

Genre.create([{
  name: "First Person Shooter",
  abbreviation: "FPS"
}, {
  name: "Role Playing Game",
  abbreviation: "RPG"
}, {
  name: "Platform Video Game",
  abbreviation: "Platformer"
}, {
  name: "Racing",
  abbreviation: "Racing"
}, {
  name: "Fighting Game",
  abbreviation: "Fighting"
}], function(err, genres) {
  if(!err) console.log("Genres created!");
  console.log("genres is: ", genres);
  Platform.create([{
  name: "PC", 
  abbreviation: "PC"
  }, { 
  name: "Playstation 4", 
  abbreviation: "PS4"
  }, { 
  name: "Xbox One", 
  abbreviation: "XBONE"
  }, { 
  name: "Wii U", 
  abbreviation: "wii-u"
  }, { 
  name: "Playstation 3", 
  abbreviation: "PS3"
  }, { 
  name: "XBOX 360", 
  abbreviation: "XBOX360"
  }, { 
  name: "Wii", 
  abbreviation: "Wii"
  }, { 
  name: "Mac", 
  abbreviation: "Mac"
  }, { 
  name: "Nintendo 3DS", 
  abbreviation: "3DS"
  }, { 
  name: "PlayStation Vita", 
  abbreviation: "vita"
  }, { 
  name: "DS", 
  abbreviation: "DS"
  }, { 
  name: "Playstation Portable", 
  abbreviation: "PSP"
  }, { 
  name: "iPhone", 
  abbreviation: "iPhone"
  }, { 
  name: "Windows Phone", 
  abbreviation: "WP"
  }, { 
  name: "Android", 
  abbreviation: "Android"
  }, { 
  name: "Playstation 2", 
  abbreviation: "PS2"
  }, { 
  name: "Xbox", 
  abbreviation: "Xbox"
  }, { 
  name: "Game Boy Advance", 
  abbreviation: "GBA"
  }, { 
  name: "Gamecube", 
  abbreviation: "GC"
  }, { 
  name: "Playstation", 
  abbreviation: "PS1"
  }, { 
  name: "Nintendo 64", 
  abbreviation: "N64 "
  }, { 
  name: "Dreamcast", 
  abbreviation: "DC"
  }, { 
  name: "SEGA SATURN", 
  abbreviation: "SATURN"
  }, { 
  name: "Game Boy Color", 
  abbreviation: "GBC"
  }, { 
  name: "SEGA GENESIS", 
  abbreviation: "GENESIS"
  }, { 
  name: "Super Nintendo Entertainment System", 
  abbreviation: "SNES"
  }, { 
  name: "SEGA Mastersystem", 
  abbreviation: "SEGAMS"
  }, { 
  name: "Nintendo Entertainment System", 
  abbreviation: "NES"
  }, { 
  name: "SEGACD", 
  abbreviation: "SEGACD"
  }, { 
  name: "NGAGE", 
  abbreviation: "NGAGE"
  }, { 
  name: "Game Gear", 
  abbreviation: "GAMEGEAR"
  }, { 
  name: "Commodore 64", 
  abbreviation: "c64"
  }, { 
  name: "TurboGrafx-16", 
  abbreviation: "tg16"
  }, { 
  name: "Arcade", 
  abbreviation: "arcade"
  }], function(err, platforms) {
    if(!err) console.log("Platforms created!");
    console.log("platforms is: ", platforms);
    User.create([{
      username: "bsmith",
      email: "b@s.com",
      profilePic: "test",
      password: "password",
      passwordConfirmation: "password",
      gamePosts: []
    },{
      username: "jleslie",
      email: "j@l.com",
      profilePic: "test",
      password: "password",
      passwordConfirmation: "password",
      gamePosts: []
    },{
      username: "jwalker",
      email: "j@w.com",
      profilePic: "test",
      password: "password",
      passwordConfirmation: "password",
      gamePosts: []
    }], function(err, users) {
      if(!err) console.log("Users created!");
      console.log("users is: ", users);
      GamePost.create([{
        name: "Sonic the Hedgehog 2",
        owner: users[0],
        pictures: ["http://www.hardcoregamer.com/wp-content/uploads/2015/10/Sonic-2-1.jpg", "https://lh5.ggpht.com/PYenvBD0jyeXaFy7tfd1-DajFXeWLtgFj9LxLx7rlbHZAzOxokDD7JgaO-XZST1CmC4=h900", "http://www.rarityguide.com/museum/images/video_game_consoles/sega_genesis__1989_/sega_genesis_sonic_hedgehog_2_cart.JPG"],
        platform: platforms[24],
        genres: genres[2],
        releaseDate: new Date(1992, 11, 21)
      },{
        name: "Crash Team Racing",
        owner: users[1],
        pictures: ["http://www.justgovintage.com/images/PS1-GAME-CTR%20Crash%20Team%20Racing.JPG", "https://i.ytimg.com/vi/q5RyvAB2bTY/maxresdefault.jpg", "http://199.101.98.242/media/images/36718-Crash_Team_Racing_[U]-16.jpg", "https://upload.wikimedia.org/wikipedia/en/4/4f/CrashTeamRacingNACover.png"],
        platform: platforms[19],
        genres: genres[3],
        releaseDate: new Date(1999, 9, 30)
      },{
        name: "Pokémon Red",
        owner: users[1],
        pictures: ["http://cdn.bulbagarden.net/upload/thumb/8/80/Red_EN_boxart.png/250px-Red_EN_boxart.png", "http://s.ecrater.com/stores/134698/4b257d1203914_134698b.jpg", "http://noticias.instacodez.com/wp-content/uploads/2015/11/Pok%C3%A9mon-131115-001.jpg"],
        platform: platforms[22],
        genres: genres[1],
        releaseDate: new Date(1999, 10, 5)
      },{
        name: "Super Smash Bros",
        owner: users[0],
        pictures: ["http://thumbs3.picclick.com/d/w1600/pict/201631802526_/Super-Smash-Bros-Brothers-Nintendo-64-N64-Nrmt.jpg", "http://www.wtfgamersonly.com/wp-content/uploads/2014/08/n64_supersmashbrothers64.jpg", "https://i.ytimg.com/vi/X8QpVtb3sl0/maxresdefault.jpg", "http://www.androidheadlines.com/wp-content/uploads/2013/03/n64_super_smash_bros.jpg"],
        platform: platforms[20],
        genres: genres[4],
        releaseDate: new Date(1999, 1, 21)
      }], function(err, gamePosts) {
        if(!err) console.log("GamePosts created!");
        console.log("gamePosts are: ", gamePosts);
        mongoose.connection.close();
      });
    });
  });
});