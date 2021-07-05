'use strict';

import { task, src, dest, series, parallel } from 'gulp';
import webpack from 'webpack';
import path from 'path';
import rename from 'gulp-rename';
import serve from 'browser-sync';
import del from 'del';
import dotenv from 'dotenv';
import tar from 'gulp-tar';
import gzip from 'gulp-gzip';
import WebpackDevServer from 'webpack-dev-server';
import colorsSupported from 'supports-color';
import historyApiFallback from 'connect-history-api-fallback';

import karma from 'karma';
import eslint from 'gulp-eslint';
import gulpIf from 'gulp-if';
import fs from 'fs';
import log from 'fancy-log';
import c from 'ansi-colors';
import PluginError from 'plugin-error';
import minimist from 'minimist';
import verifier from './gulp/verifier';
const argv = minimist(process.argv.slice(2));

let root = 'app';

// Load .env file
dotenv.config({ silent: true });

// Grab backend-url from gulp options
process.env.BACKEND_URL = argv['backend-url'] || process.env.BACKEND_URL;

// Helper method for resolving paths
let resolveToApp = (glob = '') => {
    return path.join(root, glob); // app/{glob}
};

// Map of all paths
let paths = {
    js: resolveToApp('**/*!(.spec.js).js'), // exclude spec files
    html: [
        resolveToApp('**/*.html'),
        resolveToApp('index.html')
    ],
    entry: {
        "ushahidi-legacy-app": ['babel-polyfill', path.join(__dirname, root, 'bootstrap.js')],
        "activity": path.join(__dirname, root, '/activity/activity-module.js')
    },
    output: root,
    // blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
    // config: resolveToApp('config.js'),
    languages: resolveToApp('common/locales'),
    dest: path.join(__dirname, 'dist')
};

// Cleaning up directories
function clean(done) {
    del([paths.dest]).then(function (paths) {
        log('[clean]', paths);
        done();
    });
}

// Copy config.js into dist
function distConfig() {
    return src(paths.config)
        .pipe(dest(paths.dest));
}

// Build webpack for production
function distWebpack(done) {
    const config = require('./webpack.dist.config');
    config.entry.app = paths.entry;
    config.output.path = paths.dest;
    webpack(config, (err, stats) => {
        if (err) {
            throw new PluginError('webpack', err);
        }

        log('[webpack]', stats.toString({
            colors: colorsSupported,
            chunks: false,
            errorDetails: true
        }));
        done();
    });
}

// Build tarball for release
function buildTar() {
    var version = argv['version-suffix'] || require('./package.json').version;
    var dest_dir = argv['dest-dir'] || 'build';

    return src(path.join(paths.dest, '**'))
        .pipe(rename(function (filePath) {
            // Prefix path
            filePath.dirname = path.join('ushahidi-platform-client-bundle-' + version, filePath.dirname);
        }))
        .pipe(tar('ushahidi-platform-client-bundle-' + version + '.tar'))
        .pipe(gzip())
        .pipe(dest(dest_dir));
}

// Downloading translations from transifex
function copyLanguages(done) {
    // argv.dev checks if the --dev flag was sent when calling the task
    let destination = argv.dev ? path.join(__dirname, root) : paths.dest;
    // Make sure we have dest dir
    try {
        fs.mkdirSync(destination + '/locales/');
    }
    catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
    src([paths.languages + '/*']).pipe(dest(destination + '/locales/'));

    done();
}

function downloadLanguages(done) {
    // argv.dev checks if the --dev flag was sent when calling the task
    let destination = argv.dev ? path.join(__dirname, root) : paths.dest;
    require('./gulp/transifex-download')('app/common/locales/', done);
    done();
}
/**
* Build-options
*/

// use webpack.config.js to build modules
task('dist', series(clean, distWebpack, /** distConfig, **/ downloadLanguages, copyLanguages));
task('build', series('dist'));

/**
* Task `tar` - Build tarball for release
* Options
* `--version-suffix=<version>` - Specify version for output file
*/
task('tar', buildTar);

// Task `release` - Build release
task('release', series('dist', 'tar'));

/**
* Serve-options
*/

// Starting the dev-server
function devServer() {
    const config = require('./webpack.dev.config');
    const port = process.env.PORT || 3000;
    config.entry = paths.entry;
    var compiler = webpack(config);
    new WebpackDevServer(compiler, config.devServer).listen(port, 'localhost',
        (err) => {
            if (err) {
                throw new gutil.PluginError('webpack-dev-server', err);
            }
            console.log('[webpack-dev-server]', `http://localhost:${port}/webpack-dev-server/index.html`);
        }
    );
}

task('default', devServer);

//Serving the dist build (for heroku)
function serveStatic() {
    serve.init({
        server: {
            baseDir: paths.dest
        },
        port: process.env.PORT || 3000,
        ui: false,
        codeSync: false,
        open: false,
        middleware: [historyApiFallback()]
    });
}
task('serve:static', serveStatic);

/**
 * Tasks for tests
 */

//Run test once and exit
function testServer(done) {
    process.env.NODE_ENV = 'test';
    var server = new karma.Server({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, function (status) {
        done(status);
    });
    server.start();
}
task('test', testServer);

// Watch for file changes and re-run tests on each change
function startTdd(done) {
    process.env.NODE_ENV = 'test';
    var server = new karma.Server({
        configFile: __dirname + '/test/karma.conf.js',
        reporters: ['progress', 'notify'],
        autoWatch: true,
        singleRun: false
    }, function () {
        done();
    });
    server.start();
}
task('tdd', startTdd);

// Use eslint to check code
function runEslint() {
    return src(['app/**/*.js', 'test/**/*.js', 'gulpfile.babel.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}
task('eslint', runEslint);

//Use eslint to fix code
function isFixed(file) {
    if (file.eslint) {
        return file.eslint.fixed;
    } else {
        return false;
    }
}
// Fix in app-directory
function eslintFixApp() {
    return src(['app/**/*.js'])
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        // if running fix - replace existing file with fixed one
        .pipe(gulpIf(isFixed, dest('./app')))
        .pipe(eslint.failAfterError());
}
task('eslintfix:app', eslintFixApp);

// Fix in test-directory
function eslintFixTests() {
    return src(['test/**/*.js'])
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        // if running fix - replace existing file with fixed one
        .pipe(gulpIf(isFixed, dest('./test')))
        .pipe(eslint.failAfterError());
}
task('eslintfix:test', eslintFixTests);

// Fix problems in both app- and test-directories
task('eslintfix', parallel(eslintFixApp, eslintFixTests))


/**
 * Tasks for installation-helper
 */

// Setting the environment variable to enable verifier
function startVerifier(done) {
    process.env.VERIFIER = true;
    done();
}

function verify(done) {
    if (verifier.isCheckDisabled('ALL')) {
        log.info(c.green('USH_DISABLE_CHECKS is ALL, skipping verification process.'));
        done();
    }
    verifier.verifyEnv();
    verifier.verifyTransifex();
    verifier.verifyNetwork();
    verifier.verifyEndpointStatus();
    verifier.verifyEndpointStructure();
    verifier.verifyOauth();
    verifier.verifyDbConnection();
    verifier.verifyAPIEnvs();
    done();
}

// Run helper in console
task('verify', verify);

// Run helper in browser
task('dev:verifier', series(startVerifier, devServer));

// Run helper in console
task('languages', downloadLanguages);
