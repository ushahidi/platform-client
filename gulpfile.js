var gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util');

function errorHandler (err) {
  gutil.beep();
  gutil.log(err.message || err);
}

// Options
var options = {};

options.autoprefixer = {
  map: true,
  from: 'assets/css',
  to: 'style.min.css'
};

/**
 * Task: `sass`
 * Converts SASS files to CSS
 */
gulp.task('sass', function() {
    gulp.src(['assets/sass/style.scss'])
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(sass({
            includePaths : [
                'bower_components/bourbon/app/assets/stylesheets',
                'bower_components/neat/app/assets/stylesheets',
                'bower_components/refills/source/stylesheets/',
                'bower_components/font-awesome/scss/'
            ]
        }))
        .pipe(autoprefixer(options.autoprefixer))
        .pipe(plumber.stop())
        .pipe(gulp.dest('assets/css'));
});

/**
 * Task: `watch`
 * Watches files for changes
 */
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('assets/sass/**/*.scss', ['sass']);
    gulp.watch(['assets/*.html', 'assets/css/style.css'])
		.on('change', livereload.changed);
});

/**
 * Task: `default`
 * Default task optimized for development
 */
gulp.task('default', ['sass', 'watch']);
