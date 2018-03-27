'use strict';

/*  
    Autoprefix and Babel uses browserslist(https://github.com/browserslist/browserslist)
    lib to define which browsers will receive retrocompatability.
    Check key "browserslist" on package.json for the current values.
*/

// Dependecies
// --------------------------
const autoPrefixer = require('gulp-autoprefixer'),
      browserSync  = require('browser-sync'),
      imageMin     = require('gulp-imagemin'),
      plumber      = require('gulp-plumber'),
      htmlMin      = require('gulp-htmlmin'),
      rename       = require('gulp-rename'),
      babel        = require('gulp-babel'),
      sass         = require('gulp-sass'),
      gulp         = require('gulp');

// Params
// --------------------------
const compressed = { outputStyle: 'compressed' }, // Sass
      expanded   = { outputStyle: 'expanded' },   // Sass
      min        = { suffix: '-min' };            // Rename

// Paths
// --------------------------
const paths = {
    dev: {
        core: 'dev/**/*',
        images: 'dev/images/**/*',
        scripts: 'dev/scripts/*.js',
        styles: 'dev/styles/*.scss',
        views: 'dev/views/*.html'
    },
    dist: {
        core: 'dist/',
        images: 'dist/images/',
        scripts: 'dist/js/',
        styles: 'dist/css/',
        views: 'dist/html/'
    }
}

// Task - BrowserSync
// --------------------------
gulp.task('browserSync', () => {
    browserSync.init({
        server: 'dist'
    })
    gulp.start(['images', 'scripts', 'styles', 'views']);
    gulp.watch(paths.dev.scripts, ['scripts']);
    gulp.watch(paths.dev.styles, ['styles']);
    gulp.watch(paths.dev.views, ['views']);
    gulp.watch(paths.dev.images, ['images']);
    gulp.watch(paths.dist.core).on('change', () => {
      browserSync.reload()
    });
});

// Task - Styles
// --------------------------
gulp.task('styles', () => {
    gulp.src(paths.dev.styles)
        .pipe(plumber())
        .pipe(autoPrefixer({
            cascade: false,
            grid: true
        }))
        .pipe(sass(compressed))
        .pipe(rename(min))
        .pipe(gulp.dest(paths.dist.styles));
})

// Task - Views
// --------------------------
gulp.task('views', () => {
    gulp.src(paths.dev.views)
        .pipe(plumber())
        .pipe(htmlMin({ 
            collapseWhitespace: true
        }))
        .pipe(rename(min))
        .pipe(gulp.dest(paths.dist.core));
});

// Task - Scripts
// --------------------------
gulp.task('scripts', () => {
    gulp.src(paths.dev.scripts)
        .pipe(plumber())
        .pipe(babel({
            'presets': ['env'],
            'minified': true
        }))
        .pipe(rename(min))
        .pipe(gulp.dest(paths.dist.scripts));
});

// Task - Images
// --------------------------
gulp.task('images', () => {
    gulp.src(paths.dev.images)
        .pipe(plumber())
        .pipe(imageMin())
        .pipe(gulp.dest(paths.dist.images))
});

// Task - Gulp
// --------------------------
gulp.task('default', ['browserSync'])