var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    livereload   = require('gulp-livereload'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename'),
    gutil        = require('gulp-util'),
    notify       = require('gulp-notify'),
    source       = require('vinyl-source-stream'),
    browserify   = require('browserify'),
    watchify    = require('watchify'),
    envify       = require('envify/custom'),
    fs           = require('fs'),
    karma        = require('karma').server,
    buffer       = require('vinyl-buffer'),
    uglify       = require('gulp-uglify'),
    sourcemaps   = require('gulp-sourcemaps'),
    bump         = require('gulp-bump'),
    tar          = require('gulp-tar'),
    gzip         = require('gulp-gzip'),
    jscs         = require('gulp-jscs'),
    dotenv       = require('dotenv'),
    Transifex    = require('transifex');

// Grab env vars from .env file
dotenv.load({silent: true});
// load user defined options
if (fs.existsSync('.gulpconfig.json')) {
    gutil.log('.gulpconfig.json is deprecated. Please use .env');
}

var defaultOptions = {
    nodeServer: false,
    mockBackend: false,
    useChromeForKarma : false,
    backendUrl: false,
    uglifyJs: true,
    compressedCSS: true
};

function getBooleanOption(value, defaultValue) {
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    return defaultValue;
}

var options = {
    nodeServer          : gutil.env['node-server'] || getBooleanOption(process.env.NODE_SERVER, defaultOptions.nodeServer),
    mockBackend         : gutil.env['mock-backend'] || getBooleanOption(process.env.MOCK_BACKEND, defaultOptions.mockBackend),
    useChromeForKarma   : gutil.env['karma-chrome'] || getBooleanOption(process.env.KARMA_CHROME, defaultOptions.useChromeForKarma),
    backendUrl          : gutil.env['backend-url'] || process.env.BACKEND_URL,
    uglifyJs            : gutil.env['uglify-js'] || getBooleanOption(process.env.UGLIFY_JS, defaultOptions.uglifyJs),
    compressedCSS       : gutil.env['compressed-css'] || getBooleanOption(process.env.COMPRESSED_CSS, defaultOptions.compressedCSS),
    www                 : 'server/www'
};

// Helpers
var helpers = {
    getBrowserifyConfig: function (mainEntryFile) {
        var entries = [mainEntryFile || './app/app.js'];

        if (options.mockBackend) {
            gutil.log('Building with mock backend');
            entries.push('./app/mock-backend-config.js');
            entries.push('./app/test-bootstrap.js');
        } else {
            entries.push('./app/bootstrap.js');
        }

        return {
            cache: {},
            packageCache: {},
            fullPaths: true,
            debug: true,
            entries: entries
        };
    },
    setBackendUrl: function () {
        return envify({
            BACKEND_URL: options.backendUrl
        });
    },
    createDefaultTaskDependencies: function () {
        var dependencies = ['build', 'watch'];

        if (options.nodeServer) {
            dependencies.push('node-server');
        }

        return dependencies;
    }
};

function errorHandler(error) {
    gutil.beep();
    gutil.log(error);
    notify.onError('Error: <%= error.message %>')(error);
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
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                'node_modules/'
            ],
            sourceComments: false,
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(plumber.stop())
        .pipe(sourcemaps.write('./'))
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
            options.compressedCSS ? 'node_modules/platform-pattern-library/assets/css/*.min.css' : 'node_modules/platform-pattern-library/assets/css/*.css',
            'node_modules/platform-pattern-library/assets/css/*.css.map'
            ])
        .pipe(rename(function (path) {
            // If using compressedCSS, string the .min from filenames
            if (options.compressedCSS) {
                path.basename = path.basename.replace('.min', '');
            }
        }))
        .pipe(gulp.dest(options.www + '/css'));
});

/** 
 * Copy icon files for leaflet from node_modules into server/www/css/images
 */
gulp.task('copy-leaflet-icons', [], function () {
    return gulp.src(['node_modules/leaflet/dist/images/*'])
        .pipe(gulp.dest(options.www + '/img'));
});

gulp.task('rename', [
    'copy-leaflet-icons'
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
            errorHandler(err);
            throw err;
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
 * Task: `watchify`
 * Monitor js changes with watchify
 */
gulp.task('watchify', function () {
    var stream = watchify(browserify(helpers.getBrowserifyConfig()))
    .on('update', function () {
        bundleBrowserify(stream);
    })
    .transform('brfs')
    .transform(helpers.setBackendUrl());

    return bundleBrowserify(stream);
});

function bundleBrowserify(stream) {
    return stream.bundle()
        .on('error', function (err) {
            errorHandler(err);
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(options.www + '/js'))
        .pipe(notify('JS compiled'))
        .pipe(livereload());
}

/**
 * Task: `build`
 * Builds sass, fonts and js
 */
gulp.task('build', ['sass', 'css', 'font', 'browserify']);

/**
 * Task: `watch`
 * Rebuilds styles and runs live reloading.
 */
gulp.task('watch', ['watchify'], function () {
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('server/www/**/*.html', ['html']);
});

/**
 * Html task just trigger livereload when html changes
 */
gulp.task('html', [], function () {
    return gulp.src(['server/www/**/*.html'])
        .pipe(livereload())
        ;
});

/**
 * Task: `node-server`
 * Runs a simple node connect server and runs live reloading.
 */
gulp.task('node-server', [], require('./server/server'));

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    var browsers = options.useChromeForKarma ? ['Chrome'] : ['PhantomJS'];
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
    var browsers = options.useChromeForKarma ? ['Chrome'] : ['PhantomJS'];
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
gulp.task('release', ['transifex-download'], function () {
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
 * Task: `transifex-download`
 * Download translations from www.transifex.com
 */
gulp.task('transifex-download', function () {
    var project_slug = 'ushahidi-v3',
        locales_dir = options.www + '/locales/',
        mode = 'default',
        resource = 'client-en',
        config = {};

    // Try to load user's ~/.transifexrc config
    // see http://docs.transifex.com/client/config/
    try {
        config = dotenv.parse(fs.readFileSync(process.env.HOME + '/.transifexrc'));
    } catch (e) {
        // silently skip
    }

    // Try to load username/password from env
    config.username = config.username || process.env.TX_USERNAME;
    config.password = config.password || process.env.TX_PASSWORD;

    if (!config.username || !config.password) {
        throw 'Missing transifex username and password';
    }

    var transifex = new Transifex({
        project_slug: project_slug,
        credential: config.username + ':' + config.password
    });

    // Download languages
    transifex.languageSetMethod(project_slug, function (err, data) {
        if (err) {
            throw err;
        }

        try {
            fs.mkdirSync(locales_dir);
        }
        catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }

        // Download translations for each language code
        data.forEach(function (language) {
            transifex.translationInstanceMethod(project_slug, resource, language.language_code, { mode: mode }, function (err, data) {
                if (err) {
                    throw err;
                }

                fs.writeFileSync(locales_dir +
                                 // Replace underscore with hyphen
                                 language.language_code.replace('_', '-') +
                                 '.json', data);
            });
        });
    });
});


/**
 * Task: `default`
 * Default task optimized for development
 */
gulp.task('default', helpers.createDefaultTaskDependencies());
