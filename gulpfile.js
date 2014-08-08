var gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    exec = require('child_process').exec;

function errorHandler (err) {
  gutil.beep();
  gutil.log(err.message || err);
}

// Options
// - (bool) vm: enable docker builds, default: false
var options = {
    vm: false
};

/**
 * Task: `sass`
 * Converts SASS files to CSS
 */
gulp.task('sass', function() {
    var options = {
      map: true,
      from: 'www/css',
      to: 'style.min.css'
    };
    gulp.src(['sass/style.scss'])
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(sass({
            includePaths : [
                'bower_components/bourbon/app/assets/stylesheets',
                'bower_components/neat/app/assets/stylesheets',
                'bower_components/refills/source/stylesheets',
                'bower_components/font-awesome/scss'
            ],
            sourceMap: 'sass',
            // using 'map' causes an error: https://github.com/sass/node-sass/issues/337
            sourceComments: 'none'
        }))
        .pipe(autoprefixer(options))
        .pipe(plumber.stop())
        .pipe(gulp.dest('www/css'));
});

/**
 * Task: `docker:stop`
 * Stops any docker containers.
 */
gulp.task('docker:stop', function(cb) {
    exec('docker ps -a | grep ushahidi-client | awk \'{print $1}\' | xargs docker stop | xargs docker rm', function(err, stdout, stderr) {
        cb(/* ignore err */);
    });
});

/**
 * Task: `docker:build`
 * Rebuilds the docker container.
 */
gulp.task('docker:build', ['docker:stop'], function (cb) {
    exec('docker build -t ushahidi-client-server --quiet=true .', function(err, stdout, stderr) {
        if (err) {
            return cb(err);
        }
        console.log(stdout);
        cb();
    });
});

/**
 * Task: `docker`
 * Runs the docker container.
 */
gulp.task('docker', ['docker:build'], function(cb) {
    exec('docker run --name=ushahidi-client -d -p 80:80 ushahidi-client-server', function(err, stdout, stderr) {
        if (err) {
            return cb(err);
        }
        var ip = 'localhost';
        exec('boot2docker ip', function(err, stdout, stderr) {
            if (!err) {
                ip = stdout;
            }
            console.log('server is live @ http://' + ip + '/');
            livereload.changed();
            cb();
        });
    });
});

/**
 * Task: `watch`
 * Rebuilds styles and runs live reloading.
 */
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch(['www/*.html', 'www/css/style.css']).on('change', function(file) {
        livereload.changed(file);
    });
});

/**
 * Task: `vm`
 * Rebuilds the vm and runs live reloading.
 */
gulp.task('vm', function() {
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch(['Dockerfile', 'www/*.html', 'www/css/style.css'], ['docker']);
});

/**
 * Task: `default`
 * Default task optimized for development
 */
gulp.task('default', options.vm ? ['vm'] : ['sass', 'watch']);
