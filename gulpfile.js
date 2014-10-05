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
    cors = require('cors'),
    url = require('url'),
    envify = require('envify/custom'),

    mockBackendFlag = gutil.env['mock-backend'],
    useNodeserverFlag = gutil.env.nodeserver;

function errorHandler (err) {
    gutil.beep();
    gutil.log(err.message || err);
}

// Options
// - (bool) vm: enable docker builds, default: false
var options = {
    vm: false,
    nodeserver: false,
    www: 'server/www',
    backendUrl: 'http://ushahidi-backend',
    mockedBackendUrl: 'http://localhost:8081'
};

var helpers = {
  browserifyConfig:
    {
      entries : './app/app.js',
      debug : true,
    },
  setBackendUrl: function(){
    return envify({
      backend_url: mockBackendFlag ?
        options.mockedBackendUrl : options.backendUrl
    });
  },
  createDefaultTaskDependencies: function (){
    var mode = options.vm ? 'vm' : 'direct';
    mode = options.nodeserver ? 'nodeserver' : mode;
    // when the command line flag '--nodeserver' is passed in,
    // we want to force using nodeserver
    // (even if it is set to 'false' in the options hash)
    mode = useNodeserverFlag ? 'nodeserver' : mode;

    var dependencies = ['build', mode];
    if(mockBackendFlag)
    {
      dependencies.push('mock-backend');
    }
    return dependencies;
  }
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
        .pipe(gulp.dest(options.www + '/css'));
});

/**
 * Task: `font`
 * Copies font files to public directory.
 */
gulp.task('font', function() {
    gulp.src(['bower_components/font-awesome/fonts/fontawesome*'])
        .pipe(gulp.dest(options.www + '/fonts'));
});

/**
 * Task: `browserify`
 * Bundle js with browserify
 */
gulp.task('browserify', function() {
    browserify(helpers.browserifyConfig)
        .transform('brfs')
        .transform(helpers.setBackendUrl())
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(options.www + '/js'));
});

/**
 * Task: `watchify`
 * Watch js and rebundle with browserify
 */
gulp.task('watchify', function() {
    var bundler = watchify(browserify(helpers.browserifyConfig, watchify.args))
    .transform('brfs')
    .transform(helpers.setBackendUrl())
    .on('update', rebundle);

    function rebundle () {
        return bundler.bundle()
            .on('error', errorHandler)
            .pipe(source('bundle.js'))
            .pipe(gulp.dest(options.www + '/js'));
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
    exec('docker build -t ushahidi-client-server --quiet=true server', function(err, stdout/*, stderr*/) {
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
    exec('docker run --name=ushahidi-client -d -p 8080:80 ushahidi-client-server', function(err/*, stdout, stderr*/) {
        if (err) {
            return cb(err);
        }
        var ip = 'localhost';
        exec('boot2docker ip', function(err, stdout/*, stderr*/) {
            if (!err) {
                ip = stdout;
            }
            console.log('server is live @ http://' + ip + ':8080/');
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
    gulp.watch(['Dockerfile', options.www + '/**/*'], ['docker']);
});

/**
 * Task: mock-backend`
 * Runs a simple node connect server
 * and delivers the json files under the 'mocked_backend' folder
 */
gulp.task('mock-backend', [], function() {
    connect.server({
        root: 'mocked_backend',
        port: '8081',
        middleware: function (/*connect, opt*/) {
            return [

                cors(),

                function (req, res, next) {
                    var pathname = url.parse(req.url).pathname;
                    pathname = pathname + '.json';
                    req.url = pathname;
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
 * Task: `nodeserver`
 * Runs a simple node connect server and runs live reloading.
 */
gulp.task('nodeserver', ['watch', 'direct'], function() {
    connect.server({
        root: options.www,
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
    gulp.watch([options.www + '/**/*']).on('change', function(file) {
        livereload.changed(file);
    });
});

/**
 * Task: `default`
 * Default task optimized for development
 */
gulp.task('default', helpers.createDefaultTaskDependencies());
