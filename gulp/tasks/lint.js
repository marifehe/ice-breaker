'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const gulpif = require('gulp-if');
const argv = require('yargs').argv;

module.exports = () =>
  gulp.src(
    [
      'test/**/*.js',
      'src/**/*.js'
    ]
  )
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(gulpif(argv.fail, eslint.failAfterError()));
