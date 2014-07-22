var gulp = require('gulp');

var sass = require('gulp-sass');
var refresh = require('gulp-livereload');
var autoprefixer = require('gulp-autoprefixer');

var lr = require('tiny-lr')();

/**
 * Task: `sass`
 * Convert SASS files to CSS
 */
gulp.task('sass', function() {
    gulp.src(['sass/style.scss'])
        .pipe(sass())
		.pipe(autoprefixer())
        .pipe(gulp.dest('css'))
		.pipe(refresh(lr));
});

/**
 * Task: `html`
 * Live reloads .HTML
 */
gulp.task('html', function() {
  gulp.src(['index.html'])
    .pipe(refresh(lr));
});

/**
 * Task: `livereload`
 * Start LiveReload server
 */
gulp.task('livereload', function(next) {
  lr.listen(35730, function(err) {
    if (err) return console.error(err);
    next();
  });
});

/**
 * Task: `watch`
 * Watch SASS files for changes
 */
gulp.task('watch', ['livereload'], function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('index.html', ['html']);
});

/**
 * Task: `default`
 * Default task optimized for development
 */
gulp.task('default', ['sass', 'watch']);
