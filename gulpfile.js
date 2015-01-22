var gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    notify = require('gulp-notify'),
    exec = require('child_process').exec,
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    envify = require('envify/custom'),
    fs = require('fs'),
    merge = require('merge'),
    karma = require('karma').server,
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),

    mockBackendFlag = gutil.env['mock-backend'],
    mockBackendWithAngularHttpMockFlag = gutil.env['angular-mock-backend'],
    useNodeServerFlag = gutil.env['node-server'],
    useDockerServerFlag = gutil.env['docker-server'],
    useChromeForKarmaFlag = gutil.env['karma-chrome'];

function errorHandler (err) {
    gutil.beep();
    gutil.log(err.message || err);
    notify.onError('Error: <%= error.message %>')(err);
}

// Options
// - (bool) dockerserver: enable docker builds, default: false
var options = {
    dockerServer: false,
    nodeServer: false,
    uglifyJs: true,
    www: 'server/www',
    backendUrl: 'http://ushahidi-backend',
    mockedBackendUrl: 'http://localhost:8081'
};

// load user defined options
if (fs.existsSync('.gulpconfig.json')) {
    merge(options, require('./.gulpconfig.json'));
}

var helpers = {
    getBrowserifyConfig: function(mainEntryFile){
        var entries = [mainEntryFile || './app/app.js'];

        if (mockBackendWithAngularHttpMockFlag) {
            entries.push('./app/mock-backend-config.js');
        }

        return {
            entries : entries,
            debug : true,
        };
    },

    setBackendUrl: function(){
        return envify({
            backend_url: mockBackendFlag ? options.mockedBackendUrl : options.backendUrl
        });
    },
    createDefaultTaskDependencies: function (){
        var dependencies = ['build'];

        if (mockBackendFlag) {
            dependencies.push('mock-backend');
        }

        if (options.dockerServer || useDockerServerFlag) {
            dependencies.push('docker-server');
        } else if (options.nodeServer || useNodeServerFlag) {
            dependencies.push('node-server');
        } else {
            dependencies.push('direct');
        }

        return dependencies;
    }
};

/**
 * Task: `sass`
 * Converts SASS files to CSS
 */
gulp.task('sass', ['rename'], function() {
    gulp.src(['sass/style.scss'])
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(sass({
            includePaths : [
                'bower_components/bourbon/app/assets/stylesheets',
                'bower_components/neat/app/assets/stylesheets',
                'bower_components/refills/source/stylesheets',
                'bower_components/font-awesome/scss',
                'node_modules/angular-bootstrap-colorpicker/scss',
                'node_modules/leaflet/dist/'
            ],
            sourceComments: 'map'
        }))
        .pipe(autoprefixer())
        .pipe(plumber.stop())
        .pipe(gulp.dest(options.www + '/css'))
        .pipe(notify('CSS compiled'))
        .pipe(livereload())
        ;
});


/**
 * Task: `sass`
 * Converts SASS files to CSS
 */
gulp.task('rename-colorpicker', function() {
    gulp.src(['node_modules/angular-bootstrap-colorpicker/css/colorpicker.css'])
        .pipe(rename('_colorpicker.scss'))
        .pipe(gulp.dest('node_modules/angular-bootstrap-colorpicker/scss/'))
        ;
});
gulp.task('rename', ['rename-colorpicker'], function() {
    gulp.src(['node_modules/leaflet/dist/leaflet.css'])
        .pipe(rename('_leaflet.scss'))
        .pipe(gulp.dest('node_modules/leaflet/dist/'))
        ;
});

/**
 * Task: `font`
 * Copies font files to public directory.
 */
gulp.task('font', function() {
    gulp.src(['bower_components/font-awesome/fonts/fontawesome*'])
        .pipe(gulp.dest(options.www + '/fonts'))
        .pipe(livereload())
        ;
});

/**
 * Task: `browserify`
 * Bundle js with browserify
 */
gulp.task('browserify', function() {
    var stream = browserify(helpers.getBrowserifyConfig())
        .transform('brfs')
        .transform(helpers.setBackendUrl())
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}));

    if (options.uglifyJs) {
        stream.pipe(uglify());
    }

    stream
        // Strip sourcemaps out to another file
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(options.www + '/js'))
        .pipe(notify('JS compiled'))
        .pipe(livereload())
        ;
    return stream;
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
            livereload();
            cb();
        });
    });
});

/**
 * Task: `watch`
 * Rebuilds styles and runs live reloading.
 */
gulp.task('watch', [], function() {
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('bower_components/font-awesome/fonts/fontawesome*', ['font']);
    gulp.watch(['app/**/*.js', 'app/locales/*.json'], ['browserify']);
});

/**
 * Task: `docker-server`
 * Rebuilds the docker-server and runs live reloading.
 */
gulp.task('docker-server', ['watch'], function() {
    gulp.watch(['Dockerfile', options.www + '/**/*'], ['docker']);
});

/**
 * Task: mock-backend`
 * Runs a simple node connect server
 * and delivers the json files under the 'mocked_backend' folder
 */
gulp.task('mock-backend', [], require('./gulp/mock-backend')('mocked_backend'));

/**
 * Task: `node-server`
 * Runs a simple node connect server and runs live reloading.
 */
gulp.task('node-server', ['direct'], require('./gulp/node-server')(options.www));

/**
 * Task: `direct`
 * Rebuilds styles and runs live reloading.
 */
gulp.task('direct', ['watch'], function() {

});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    var browsers = useChromeForKarmaFlag ? ['Chrome'] : ['PhantomJS'];
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        browsers: browsers,
        singleRun: true
    }, done);
});

/**
 * Send coverage stats to coveralls.io
 */
gulp.task('send-stats-to-coveralls', function () {
    var coveralls = require('gulp-coveralls');
    gulp.src('test/coverage/**/lcov.info')
    .pipe(coveralls());

});


/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    var browsers = useChromeForKarmaFlag ? ['Chrome'] : ['PhantomJS'];
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        browsers: browsers,
        autoWatch : true,
        singleRun: false
    }, done);
});

/**
 * Task: `default`
 * Default task optimized for development
 */
gulp.task('default', helpers.createDefaultTaskDependencies());
