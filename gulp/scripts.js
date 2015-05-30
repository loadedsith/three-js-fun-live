'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('scripts', function () {
    return gulp.src(options.src + '/{app,components}/**/*.js')
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.jscs({
      	"preset": "google"
      }).on('error', function(a,b,c){
      	console.log(a.message);
      }))
      .pipe(browserSync.reload({ stream: true }))
      .pipe($.size());
  });
};
