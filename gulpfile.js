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

/**
 * Task: `sass`
 * Converts SASS files to CSS
 */
gulp.task('sass', function() {
    gulp.src(['sass/style.scss'])
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
		.pipe(autoprefixer())
        .pipe(plumber.stop())
        .pipe(gulp.dest('css'));
});

/**
 * Task: `watch`
 * Watches files for changes
 */
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch(['*.html', 'css/style.css'])
		.on('change', livereload.changed);
});

/**
 * Task: `default`
 * Default task optimized for development
 */
gulp.task('default', ['sass', 'watch']);
