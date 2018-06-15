"use strict";

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const coveralls = require('gulp-coveralls');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const util = require('gulp-util');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

const Karma = require('karma').Server;

const _coverage = 'coverage/**/lcov.info';
const _scripts = 'src/**/*.js';
const _excludeMaps = 'src/**/*.map';
const _styles = 'src/**/*.css';
const _script = 'alt-importacao-csv.js';
const _style = 'alt-importacao-csv.css';
const _dist = 'dist';

function babelStream() {
  return babel({
      presets: [
          'es2015',
          'babili'
      ]
  })
}

gulp.task('build-css', () => {
  return gulp.src(_styles)
             .pipe(concat(_style.toLowerCase()))
             .pipe(gulp.dest(_dist))
             .pipe(cssmin())
             .pipe(rename({suffix: '.min'}))
             .pipe(gulp.dest(_dist));
});

gulp.task('build', ['build-css'], () => {
  return gulp.src(_scripts)
             .pipe(concat(_script.toLowerCase()))
             .pipe(gulp.dest(_dist))
             .pipe(babelStream())
             .pipe(uglify().on('error', util.log))
             .pipe(rename({suffix: '.min'}))
             .pipe(gulp.dest(_dist));
});

gulp.task('unit_test', ['lint'], (done) => {
  Karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() {
    done();
  });
});

gulp.task('lint', () => {
  return gulp.src('src/**/*.js')
   .pipe(eslint())
   .pipe(eslint.format())
   .pipe(eslint.failAfterError());
});

gulp.task('test_ci', ['unit_test'], () => {
  return gulp.src(_coverage).pipe(coveralls());
});
