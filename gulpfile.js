'use strict';

// Dependecies
// -------------------------
// TO-DO Add Babel, eslint
const autoPrefixer = require('gulp-autoprefixer'), // CSS Auto-prefix
      browserSync  = require('browser-sync'),      // Auto reload 
      sourceMap    = require('gulp-sourcemaps'),   // Sourcemaps for any extensions
      imageMin     = require('gulp-imagemin'),     // Compression for images (jpg, png, gif)
      plumber      = require('gulp-plumber'),      // Resolve and handle errors on pipe
      rename       = require('gulp-rename'),       // Rename files
      concat       = require('gulp-concat'),       // Concat tasks
      uglify       = require('gulp-uglify'),       // Minify JS
      watch        = require('gulp-watch'),        // Watch files for changes
      sass         = require('gulp-sass'),         // Use SASS 
      gulp         = require('gulp');              // Gulp base

// Sass Styles
// -------------------------
const compressed = { outputStyle: 'compressed' },
      expanded   = { outputStyle: 'expanded'   };

// Paths
// -------------------------
const paths = {
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

// Task - BrowserSync
// -------------------------
gulp.task('browserSync', () => {
    browserSync.init({ server: 'dist' })
    gulp.start(['images', 'scripts', 'styles', 'views']);
    gulp.watch(paths.dev.scripts, ['scripts']);
    gulp.watch(paths.dev.styles,  ['styles']);
    gulp.watch(paths.dev.views,   ['views']);
    gulp.watch(paths.dev.images,  ['images']);
    gulp.watch(paths.dist.core).on('change', () => {
        browserSync.reload()
    });
});

// Task - Styles
// -------------------------
gulp.task('styles', () => {
    gulp.src(paths.dev.styles)
        .pipe(sourceMap.init())
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: 'SASS Error',
                    message: 'Error: <%= error.message %>'
                })(err);
                this.emit('End')
            }
        }))
        .pipe(autoPrefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(sass(compressed))
        .pipe(rename('style-min.css'))
        .pipe(sourceMap.write('.'))
        .pipe(gulp.dest(paths.dist.styles));
})

// Task - Views
// -------------------------
gulp.task('views', () => {
    gulp.src(paths.dev.views)
        .pipe(gulp.dest(paths.dist.core));
});

// Task - Scripts
// -------------------------
gulp.task('scripts', () => {
    gulp.src(paths.dev.scripts)
        .pipe(uglify())
        .pipe(rename('app-min.js'))
        .pipe(gulp.dest(paths.dist.scripts));
});

// Task - Images
// -------------------------
gulp.task('images', () => {
    gulp.src(paths.dev.images)
        .pipe(imageMin())
        .pipe(gulp.dest(paths.dist.images))
});

// Task - Gulp
// -------------------------
gulp.task('default', ['browserSync'])