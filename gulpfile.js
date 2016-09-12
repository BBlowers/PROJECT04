var gulp = require('gulp');
var bower = require('main-bower-files');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var runSeq = require('run-sequence');
var pump = require('pump');
 
var rename = require('gulp-rename');  
var uglify = require('gulp-uglify');  

var cleanCSS = require('gulp-clean-css');

var replace = require('gulp-replace');
 
gulp.task('default', function () {
  gulp.src('src/index.html')
    .pipe(replace({
      patterns: [
        {
          match: 'foo',
          replacement: 'bar'
        }
      ]
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('bower', function() {
  var jsFilter = filter('**/*.js', { restore: true });
  var cssFilter = filter('**/*.css');

  return gulp.src(bower())
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('concat', function() {
  gulp.src(['lib/**/app.js', 'lib/**/*.js', 'lib/**/**/*.js', 'lib/**/**/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('sass', function() {
  gulp.src('lib/scss/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'));
});

gulp.task('copy', function() {
  gulp.src('lib/templates/**/**')
    .pipe(gulp.dest('public/templates'));
})

gulp.task('compress', function (cb) {
  pump([
        gulp.src('public/js/*.js'),
        rename('app.min.js'),
        uglify(),
        gulp.dest('public/js')
    ],
    cb
  );
});

gulp.task('minify-css', function() {
  return gulp.src('public/css/*.css')
    .pipe(rename('app.min.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/css'));
});
 
gulp.task('replace:prod', function(){
  gulp.src(['public/index.html'])
    .pipe(replace('app.css', 'app.min.css'))
    .pipe(replace('app.js', 'app.min.js'))
    .pipe(gulp.dest('public/'));
});
 
gulp.task('replace:dev', function(){
  gulp.src(['public/index.html'])
    .pipe(replace('app.min.css', 'app.css'))
    .pipe(replace('app.min.js', 'app.js'))
    .pipe(gulp.dest('public/'));
});

gulp.task('default', ['replace:dev'], function() {
  livereload.listen();

  gulp.watch(['lib/**/*', 'public/index.html', 'public/templates/**'], function() {
    runSeq(['concat', 'sass', 'copy'], function() {
      livereload.reload('public/index.html');
    });
  });

  gulp.watch('bower.json', function() {
    runSeq('bower', function() {
      livereload.reload('public/index.html');
    });
  });

});

gulp.task('build', function() {
  runSeq('bower', ['sass', 'concat'], 'compress', 'minify-css', 'replace:prod')
});