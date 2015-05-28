var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    livereload   = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename'),
    gutil        = require('gulp-util'),
    notify       = require('gulp-notify'),
    exec         = require('child_process').exec,
    source       = require('vinyl-source-stream'),
    browserify   = require('browserify'),
    envify       = require('envify/custom'),
    fs           = require('fs'),
    merge        = require('merge'),
    karma        = require('karma').server,
    buffer       = require('vinyl-buffer'),
    uglify       = require('gulp-uglify'),
    sourcemaps   = require('gulp-sourcemaps'),
    bump         = require('gulp-bump'),
    tar          = require('gulp-tar'),
    gzip         = require('gulp-gzip'),
    jscs         = require('gulp-jscs'),

    mockBackendFlag                    = gutil.env['mock-backend'],
    mockBackendWithAngularHttpMockFlag = gutil.env['angular-mock-backend'],
    useNodeServerFlag                  = gutil.env['node-server'],
    useDockerServerFlag                = gutil.env['docker-server'],
    useChromeForKarmaFlag              = gutil.env['karma-chrome'],
    backendUrl                         = gutil.env['backend-url'] || process.env.BACKEND_URL,

    // Options
    options = {
        // - (bool) dockerserver: enable docker builds, default: false
        dockerServer: false,
        nodeServer: false,
        uglifyJs: true,
        www: 'server/www',
        mockedBackendUrl: 'http://localhost:8081'
    },

    // Helpers
    helpers = {
        getBrowserifyConfig: function (mainEntryFile) {
            var entries = [mainEntryFile || './app/app.js'];

            if (mockBackendWithAngularHttpMockFlag) {
                entries.push('./app/mock-backend-config.js');
            }

            return {
                entries: entries,
                debug: true
            };
        },
        setBackendUrl: function () {
            backendUrl = backendUrl ? backendUrl : options.backendUrl;
            return envify({
                BACKEND_URL: mockBackendFlag ? options.mockedBackendUrl : backendUrl
            });
        },
        createDefaultTaskDependencies: function () {
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
    }
    ;

function errorHandler(err) {
    gutil.beep();
    gutil.log(err.message || err);
    notify.onError('Error: <%= error %>')(err.message || err);
}

// load user defined options
if (fs.existsSync('.gulpconfig.json')) {
    merge(options, require('./.gulpconfig.json'));
}

/**
 * Task: `sass`
 * Converts SASS files to CSS
 */
gulp.task('sass', ['rename'], function () {
    return gulp.src(['sass/*.scss'])
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(sass({
            includePaths: [
                'node_modules/'
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
 * Task: `css`
 * Move CSS from pattern library into server/www
 */
gulp.task('css', [], function () {
    return gulp.src([
                    'node_modules/platform-pattern-library/assets/css/*'
                    ])
        .pipe(gulp.dest(options.www + '/css'));
});

/**
 * Rename tasks
 */
gulp.task('rename-colorpicker', function () {
    return gulp.src(['node_modules/angular-bootstrap-colorpicker/css/colorpicker.css'])
        .pipe(rename('_colorpicker.scss'))
        .pipe(gulp.dest('node_modules/angular-bootstrap-colorpicker/scss/'))
        ;
});
gulp.task('rename-leaflet', [], function () {
    return gulp.src(['node_modules/leaflet/dist/leaflet.css'])
        .pipe(rename('_leaflet.scss'))
        .pipe(gulp.dest('node_modules/leaflet/dist/'))
        ;
});
gulp.task('rename-leaflet-markercluster', [], function () {
    return gulp.src(['node_modules/leaflet.markercluster/dist/MarkerCluster.css'])
        .pipe(rename('_MarkerCluster.scss'))
        .pipe(gulp.dest('node_modules/leaflet.markercluster/dist/'))
        ;
});
gulp.task('rename-leaflet-markercluster-default', [], function () {
    return gulp.src(['node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css'])
        .pipe(rename('_MarkerCluster.Default.scss'))
        .pipe(gulp.dest('node_modules/leaflet.markercluster/dist/'))
        ;
});
gulp.task('rename-nvd3', function () {
    return gulp.src(['node_modules/nvd3/build/nv.d3.css'])
        .pipe(rename('_nv.d3.scss'))
        .pipe(gulp.dest('node_modules/nvd3/build'))
        ;
});

/**
 * Copy icon files for leaflet from node_modules into server/www/css/images
 */
gulp.task('copy-leaflet-icons', [], function () {
    return gulp.src(['node_modules/leaflet/dist/images/*'])
        .pipe(gulp.dest(options.www + '/img'));
});

gulp.task('rename', [
    'copy-leaflet-icons',
    'rename-leaflet',
    'rename-colorpicker',
    'rename-leaflet-markercluster',
    'rename-leaflet-markercluster-default',
    'rename-nvd3'
    ], function () {});

/**
 * Task: `font`
 * Copies font files to public directory.
 */
gulp.task('font', function () {
    return gulp.src(['node_modules/platform-pattern-library/assets/fonts/**'])
        .pipe(gulp.dest(options.www + '/fonts'))
        .pipe(livereload())
        ;
});

/**
 * Task: `browserify`
 * Bundle js with browserify
 */
gulp.task('browserify', function () {
    var stream = browserify(helpers.getBrowserifyConfig())
        .transform('brfs')
        .transform(helpers.setBackendUrl())
        .bundle()
        .on('error', function (err) {
            errorHandler(err.message);
            this.emit('end');
        })
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
gulp.task('build', ['sass', 'css', 'font', 'browserify']);

/**
 * Task: `docker:stop`
 * Stops any docker containers.
 */
gulp.task('docker:stop', function (cb) {
    exec('docker ps -a | grep ushahidi-client | awk \'{print $1}\' | xargs docker stop | xargs docker rm', function (/*err, stdout, stderr*/) {
        cb(/* ignore err */);
    });
});

/**
 * Task: `docker:build`
 * Rebuilds the docker container.
 */
gulp.task('docker:build', ['docker:stop'], function (cb) {
    exec('docker build -t ushahidi-client-server --quiet=true server', function (err, stdout/*, stderr*/) {
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
gulp.task('docker', ['docker:build'], function (cb) {
    exec('docker run --name=ushahidi-client -d -p 8080:80 ushahidi-client-server', function (err/*, stdout, stderr*/) {
        if (err) {
            return cb(err);
        }

        var ip = 'localhost';
        exec('boot2docker ip', function (err, stdout/*, stderr*/) {
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
gulp.task('watch', [], function () {
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch(['app/**/*.js', 'app/**/*.json'], ['browserify']);
});

/**
 * Task: `docker-server`
 * Rebuilds the docker-server and runs live reloading.
 */
gulp.task('docker-server', ['watch'], function () {
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
gulp.task('direct', ['watch'], function () {

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
        autoWatch: true,
        singleRun: false
    }, done);
});

/**
 * Run JSCS tests
 */
gulp.task('jscs', function () {
    return gulp.src(['app/**/*.js', 'test/**/*.js'])
        .pipe(jscs());
});

/**
 * Task `bump` - bump version in package.json
 * Options
 * `--gulp-version=<version>` - Specify version to bump to
 * `--type` - Semver version type to bump
 */
gulp.task('bump', function () {
    var options = {
        type: gutil.env.type,
        version: gutil.env['bump-version']
    };

    return gulp.src(['./package.json'])
        .pipe(bump(options))
        .pipe(gulp.dest('./'));
});

/**
 * Task `tar` - Build tarball for release
 * Options
 * `--version-suffix=<version>` - Specify version for output fil
 */
gulp.task('tar', ['build'], function () {
    var version = gutil.env['version-suffix'] || require('./package.json').version;

    return gulp.src('server/www/**')
        .pipe(rename(function (path) {
            // Prefix path
            path.dirname = 'platform-client/' + path.dirname;
        }))
        .pipe(tar('platform-client-' + version + '.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('build'))
        .pipe(notify('Created tarball build/<%= file.relative %>'));
});

/**
 * Task `release` - Build release
 */
gulp.task('release', function () {
    // Enable uglifyjs
    options.uglifyJs = true;

    // @todo update this once gulp 4 is out
    return gulp.run('tar');
});

/**
 * Task `heroku:dev` - builds app for heroku
 */
gulp.task('heroku:dev', ['build'], function () {});

/**
 * Task: `default`
 * Default task optimized for development
 */
gulp.task('default', helpers.createDefaultTaskDependencies());
