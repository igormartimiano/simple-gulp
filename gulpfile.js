'use strict';

// Dependecies
// -------------------------
const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      watch        = require('gulp-watch'),
      concat       = require('gulp-concat'),
      rename       = require('gulp-rename'),
      plumber      = require('gulp-plumber'),
      imageMin     = require('gulp-imagemin'),
      sourceMap    = require('gulp-sourcemaps'),
      browserSync  = require('browser-sync'),
      autoPrefixer = require('gulp-autoprefixer');

// Sass Styles
// -------------------------
const compressed = { outputStyle: 'compressed' },
      expanded   = { outputStyle: 'expanded'   };

// Paths
// -------------------------
const path = {
    dev: {
        core: 'dev/**/*',
        images: 'dev/images/**/*',
        scripts: 'dev/scripts/*.js',
        styles: 'dev/styles/*.scss',
        views: 'dev/views/*.html'
    },
    dist: {
        core: 'dist/**/*',
        images: 'dist/images/',
        scripts: 'dist/js/',
        styles: 'dist/css/',
        views: 'dist/html/'
    }
}

const { log } = console;

// Task - BrowserSync
// -------------------------
gulp.task('browserSync', () => {
    browserSync.init({ server: 'dist' })
    gulp.start(['images', 'scripts', 'styles', 'views']);
    gulp.watch(path.dev.scripts, ['scripts']);
    gulp.watch(path.dev.styles,  ['styles']);
    gulp.watch(path.dev.views,   ['views']);
    gulp.watch(path.dev.images,  ['images']);
    gulp.watch(path.dist.core).on('change', () => {
        browserSync.reload()
    });
});

// Task - Styles
// -------------------------
gulp.task('styles', () => {
    gulp.src(path.dev.styles)
        .pipe(sourceMap.init())
        .pipe(plumber({
        handleError: function(error){
            log(error);
            this.emit('Task Styles - Ending the process');
        }
        }))
        .pipe(autoPrefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(sass(compressed))
        .pipe(rename('style-min.css'))
        .pipe(sourceMap.write('.'))
        .pipe(gulp.dest(path.dist.styles));
})

// Task - Views
// -------------------------
gulp.task('views', () => {
    gulp.src(path.dev.views)
        .pipe(gulp.dest(path.dist.core));
});

// Task - Scripts
// -------------------------
gulp.task('scripts', () => {
    gulp.src(path.dev.scripts)
        .pipe(gulp.dest(path.dist.scripts));
});

// Task - Images
// -------------------------
gulp.task('images', () => {
    gulp.src(path.dev.images)
        .pipe(imageMin())
        .pipe(gulp.dest(path.dist.images))
});

// Task - Gulp
// -------------------------
gulp.task('default', ['browserSync'])