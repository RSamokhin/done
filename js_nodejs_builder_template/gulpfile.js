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
    opn         = require('opn');
var path = {
    build:{
        html    : 'build/',
        js      : 'build/js/',
        css     : 'build/css/',
        img     : 'build/img/',
        fonts   : 'build/fonts/'
    },
    src:{
        html    : 'src/*.html',
        js      : 'src/js/main.js',
        css     : 'src/style/main.scss',
        img     : 'src/img/**/*.*',
        fonts   : 'src/fonts/**/*.*'
    },
    watch:{
        html    : 'src/**/*.html',
        js      : 'src/js/**/*.js',
        css     : 'src/style/**/*.scss',
        img     : 'src/img/**/*.*',
        fonts   : 'src/fonts/**/*.*'
    }
}