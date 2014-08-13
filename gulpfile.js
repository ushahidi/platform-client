var gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    exec = require('child_process').exec,
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    connect = require('gulp-connect'),
    path = require('path'),
    url = require('url');

function errorHandler (err) {
    gutil.beep();
    gutil.log(err.message || err);
}

// Options
// - (bool) vm: enable docker builds, default: false
var options = {
    vm: false,
    nodeserver: false,
};

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
                'bower_components/refills/source/stylesheets',
                'bower_components/font-awesome/scss'
            ],
            // using 'map' causes an error: https://github.com/sass/node-sass/issues/337
            sourceComments: 'normal'
        }))
        .pipe(autoprefixer())
        .pipe(plumber.stop())
        .pipe(gulp.dest('www/css'));
});

/**
 * Task: `font`
 * Copies font files to public directory.
 */
gulp.task('font', function() {
    gulp.src(['bower_components/font-awesome/fonts/fontawesome*'])
	.pipe(gulp.dest('./www/fonts'));
});

/**
 * Task: `browserify`
 * Bundle js with browserify
 */
gulp.task('browserify', function() {
    browserify({
            entries : './app/app.js',
            debug : true,
        })
        .transform('brfs')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./www/js/'));
});

/**
 * Task: `watchify`
 * Watch js and rebundle with browserify
 */
gulp.task('watchify', function() {
    var bundler = watchify(browserify({
            entries : './app/app.js',
            debug : true,
        }, watchify.args))
    .transform('brfs')
    .on('update', rebundle);

    function rebundle () {
        livereload.changed();
        return bundler.bundle()
            .on('error', errorHandler)
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./www/js'));
    }
});

/**
 * Task: `build`
 * Builds sass, fonts and js
 */
gulp.task('build', ['sass', 'font', 'browserify'], function() {

});

/**
 * Task: `docker:stop`
 * Stops any docker containers.
 */
gulp.task('docker:stop', function(cb) {
    exec('docker ps -a | grep ushahidi-client | awk \'{print $1}\' | xargs docker stop | xargs docker rm', function(/*err, stdout, stderr*/) {
        cb(/* ignore err */);
    });
});

/**
 * Task: `docker:build`
 * Rebuilds the docker container.
 */
gulp.task('docker:build', ['docker:stop'], function (cb) {
    exec('docker build -t ushahidi-client-server --quiet=true .', function(err, stdout/*, stderr*/) {
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
    exec('docker run --name=ushahidi-client -d -p 80:80 ushahidi-client-server', function(err/*, stdout, stderr*/) {
        if (err) {
            return cb(err);
        }
        var ip = 'localhost';
        exec('boot2docker ip', function(err, stdout/*, stderr*/) {
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
gulp.task('watch', ['watchify'], function() {
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('bower_components/font-awesome/fonts/fontawesome*', ['font']);
});

/**
 * Task: `vm`
 * Rebuilds the vm and runs live reloading.
 */
gulp.task('vm', ['watch'], function() {
    gulp.watch(['Dockerfile', 'www/**/*'], ['docker']);
});

/**
 * Task: `nodeserver`
 * Runs a simple node connect server and runs live reloading.
 */
gulp.task('nodeserver', ['watch', 'direct'], function() {
    connect.server({
        root: 'www',
        middleware: function (/*connect, opt*/) {
            return [
                function (req, res, next) {
                    var pathname = url.parse(req.url).pathname;
                    if (!path.extname(pathname)) {
                        req.url = '/';
                    }
                    next();
                }
            ];
        }
    });
});

/**
 * Task: `direct`
 * Rebuilds styles and runs live reloading.
 */
gulp.task('direct', ['watch'], function() {
    gulp.watch(['www/**/*']).on('change', function(file) {
        livereload.changed(file);
    });
});

/**
 * Task: `default`
 * Default task optimized for development
 */
var mode = options.vm ? 'vm' : 'direct';
var mode = options.nodeserver ? 'nodeserver' : mode;
gulp.task('default', ['build', mode]);
