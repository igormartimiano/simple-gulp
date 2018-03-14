//
//  Constants
//

const gulp        = require('gulp');
const sass        = require('gulp-sass');
const rename      = require('gulp-rename');
const browserSync = require('browser-sync').create();

const sassSrc = './src/scss/main.scss';
const cssDest = './css';

const sassExpanded   = { outputStyle: 'expanded' };
const sassCompressed = { outputStyle: 'compressed' };


//
//  Tasks
//

gulp.task('sassdev', () =>
    gulp.src(sassSrc)
        .pipe(sass(sassExpanded).on('error', sass.logError))
        .pipe(gulp.dest(cssDest))
        .pipe(browserSync.stream())
);

gulp.task('sassprod', () =>
    gulp.src(sassSrc)
        .pipe(sass(sassCompressed).on('error', sass.logError))
        .pipe(rename('main-min.css'))
        .pipe(gulp.dest(cssDest))
        .pipe(browserSync.stream())
);

gulp.task('watch', ['sassdev', 'sassprod'], () =>
    browserSync.init({ server: "./" }),
    gulp.watch(sassSrc, ['sassdev', 'sassprod']),
    gulp.watch("app/index.html").on('change', browserSync.reload)
);

gulp.task('default', ['sassdev', 'sassprod', 'watch'])