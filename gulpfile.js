var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	pug = require('gulp-pug'),
	refresh = require('gulp-refresh'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	pump = require('pump'),
	webserver = require('gulp-webserver'),
	livereload = require('gulp-livereload'),
	express = require('gulp-dev-express');

// Get one .styl file and render
gulp.task('stylus', function () {
  return gulp.src('./src/css/style.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./dist/css/'))
	.pipe(livereload());
});

// Options
// Options compress
gulp.task('compress', function () {
  return gulp.src('./src/style.css')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./dist/css'));
});


gulp.task('scripts', function() {
  return gulp.src('./src/js/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./dist/js'))
	.pipe(livereload());
});


gulp.task('uglify', function (cb) {
  pump([
        gulp.src('./src/index.js'),
        uglify(),
        gulp.dest('./dist/js')
    ],
    cb
  );
});

gulp.task('dev', function () {
	gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('watch', () => {
	gulp.start('default');
	livereload.listen()
	gulp.watch('./src/css/**/*.styl', ['stylus'])
	gulp.watch('./src/js/*.js', ['scripts'])
});

gulp.task('default', ['stylus', 'compress', 'scripts', 'dev']);
