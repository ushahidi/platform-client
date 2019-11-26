'use strict';

import {task, src, dest, series} from 'gulp';
import webpack  from 'webpack';
import path     from 'path';
import rename   from 'gulp-rename';
import serve    from 'browser-sync';
import del      from 'del';
import dotenv   from 'dotenv';
import tar      from 'gulp-tar';
import gzip     from 'gulp-gzip';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import colorsSupported      from 'supports-color';
import historyApiFallback   from 'connect-history-api-fallback';
import karma     from 'karma';
import jscs      from 'gulp-jscs';
import fs        from 'fs';
import log       from 'fancy-log';
import c         from 'ansi-colors';
import PluginError from 'plugin-error';
import minimist  from 'minimist';
import verifier from './gulp/verifier';
const argv = minimist(process.argv.slice(2));

let root = 'app';

// Load .env file
dotenv.config({silent: true});

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
    entry: [
      'babel-polyfill',
      path.join(__dirname, root, 'bootstrap.js')
    ],
    output: root,
    // blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
    config: resolveToApp('config.js'),
    dest: path.join(__dirname, 'server/www')
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
        if (err)  {
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
function transifexDownload(done) {
    // argv.dev checks if the --dev flag was sent when calling the task
    let destination = argv.dev ? path.join(__dirname, root) : paths.dest;
    // Make sure we have dest dir
    try {
        fs.mkdirSync(destination);
    }
    catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
    require('./gulp/transifex-download')(destination + '/locales/', done);
    done();
}

/**
* Build-options
*/

// use webpack.config.js to build modules
task('dist', series(clean, distWebpack, distConfig, transifexDownload));
task('build', series('dist'));

//  Builds app for heroku
task('heruku:dev', series('dist'));

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
    config.entry.app = [
      // this modules required to make HRM working
      // it responsible for all this webpack magic
      'webpack-hot-middleware/client?reload=true'
      // application entry point
    ].concat(paths.entry);

    var compiler = webpack(config);

    serve({
        port: process.env.PORT || 3000,
        open: false,
        server: {baseDir: root},
        middleware: [
            historyApiFallback(),
            webpackDevMiddleware(compiler, {
                stats: {
                    colors: colorsSupported,
                    chunks: false,
                    modules: false
                },
                publicPath: config.output.publicPath
            }),
            webpackHotMiddleware(compiler)
        ]
    });
}
task('default', devServer);
task('serve', devServer);
task('watch', devServer);

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
        middleware: [
          historyApiFallback()
        ]
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
    }, function () {
        done();
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

/**
* Tasks for JSCS
*/
// Run JSCS checks once
function runJscs() {
    return src(['app/**/*.js', 'test/**/*.js', 'gulpfile.babel.js'])
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jscs.reporter('fail'));
}
task('jscs', runJscs);

// Fix problems in app-directory
function jscsFixApp() {
    return src(['app/**/*.js'])
        .pipe(jscs({ fix : true }))
        .pipe(dest('app/'));
}
task('jscsfix:app', jscsFixApp);

// Fix problems in test-directory
function jscsFixTests() {
    return src(['test/**/*.js'])
      .pipe(jscs({ fix : true }))
      .pipe(dest('test/'));
}
task('jscsfix:test', jscsFixTests);

// Fix problems in both app- and test-directories
task('jscsfix', series('jscsfix:app', 'jscsfix:test'));

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
task('watch:verifier', series(startVerifier, devServer));
