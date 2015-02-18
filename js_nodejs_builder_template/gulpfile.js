'use strict';
var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    prefixer    = require('gulp-autoprefixer'),
    uglify      = require('gulp-uglify'),
    cssmin      = require('gulp-cssmin'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    rigger      = require('gulp-rigger'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    rimraf      = require('rimraf'),
    connect     = require('gulp-connect'),
    opn         = require('opn');он