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
var server = {
    host        : 'localhost',
    port        : '8888'
}
gulp.task('html:build',function(){
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(connect.reload())
})
gulp.task('js:build',function(){
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(connect.reload())
})
gulp.task('style:build',function(){
    gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload())
})