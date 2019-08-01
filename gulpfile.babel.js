'use strict';

import gulp     from 'gulp';
import webpack  from 'webpack';
import path     from 'path';
import runSeq   from 'run-sequence';
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
import isUrl from 'is-url';
import minimist  from 'minimist'; 
import fetch from 'node-fetch';

const argv = minimist(process.argv.slice(2));

let root = 'app';

// Load .env file
dotenv.config({silent: true});
// Grab backend-url from gulp options
process.env.BACKEND_URL = argv['backend-url'] || process.env.BACKEND_URL;
// helper method for resolving paths
let resolveToApp = (glob = '') => {
  return path.join(root, glob); // app/{glob}
};

// map of all paths
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

// use webpack.config.js to build modules
gulp.task('dist', (done) => {
    runSeq('clean', ['dist:webpack', 'dist:config', 'transifex-download'], done);
});

// Copy config.js into dist
gulp.task('dist:config', () => {
    return gulp.src(paths.config)
        .pipe(gulp.dest(paths.dest));
});

// Build webpack for production
gulp.task('dist:webpack', (done) => {
  const config = require('./webpack.dist.config');
  config.entry.app = paths.entry;
  config.output.path = paths.dest;

  webpack(config, (err, stats) => {
    if(err)  {
      throw new PluginError('webpack', err);
    }

    log('[webpack]', stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    done();
  });
});

gulp.task('build', ['dist']);

/**
 * Task `heroku:dev` - builds app for heroku
 */
gulp.task('heroku:dev', ['dist']);

gulp.task('dev', () => {
  const config = require('./webpack.dev.config');
  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true',
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
});

gulp.task('serve', ['dev']);
gulp.task('watch', ['dev']);

gulp.task('clean', (done) => {
  del([paths.dest]).then(function (paths) {
    log('[clean]', paths);
    done();
  });
});


/**
 * Run test once and exit
 */
gulp.task('test', (done) => {
    var server = new karma.Server({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, done);
    server.start();
});

/**
 * Send coverage stats to coveralls.io
 */
gulp.task('send-stats-to-coveralls', () => {
    var coveralls = require('gulp-coveralls');
    gulp.src('test/coverage/**/lcov.info')
    .pipe(coveralls());

});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', (done) => {
    var server = new karma.Server({
        configFile: __dirname + '/test/karma.conf.js',
        reporters: ['progress', 'notify'],
        autoWatch: true,
        singleRun: false
    }, done);
    server.start();
});

/**
 * Run JSCS tests
 */
gulp.task('jscs', () => {
    return gulp.src(['app/**/*.js', 'test/**/*.js', 'gulpfile.js'])
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jscs.reporter('fail'));
});
gulp.task('jscsfix', ['jscsfix:app', 'jscsfix:test'], () => {});
gulp.task('jscsfix:app', () => {
    return gulp.src(['app/**/*.js'])
        .pipe(jscs({ fix : true }))
        .pipe(gulp.dest('app/'));
});
gulp.task('jscsfix:test', () => {
    return gulp.src(['test/**/*.js'])
        .pipe(jscs({ fix : true }))
        .pipe(gulp.dest('test/'));
});

/**
 * Task `release` - Build release
 */
gulp.task('transifex-download', function (done) {
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
});

/**
 * Task `serve:static` - Serve dist build (for heroku)
 */

gulp.task('serve:static', function() {
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
});

/**
 * Task `tar` - Build tarball for release
 * Options
 * `--version-suffix=<version>` - Specify version for output fil
 */
gulp.task('tar', () => {
    var version = argv['version-suffix'] || require('./package.json').version;
    var dest_dir = argv['dest-dir'] || 'build';

    return gulp.src(path.join(paths.dest, '**'))
        .pipe(rename(function (filePath) {
            // Prefix path
            filePath.dirname = path.join('ushahidi-platform-client-bundle-' + version, filePath.dirname);
        }))
        .pipe(tar('ushahidi-platform-client-bundle-' + version + '.tar'))
        .pipe(gzip())
        .pipe(gulp.dest(dest_dir));
});

/**
 * Task `release` - Build release
 */
gulp.task('release', (done) => {
    return runSeq('dist', 'tar', done);
});

gulp.task('default', ['watch']);


gulp.task('verify', () => {
  if (isCheckDisabled('ALL')) {
    log.info(c.green('USH_DISABLE_CHECKS is ALL, skipping verification process.'));
    return;
  }
  verifyEnv();
  verifyTransifex();
  verifyNetwork();

});
function verifyNetwork(){
  if (isCheckDisabled('NETWORK')) {
    log.info(c.green('USH_DISABLE_CHECKS contains NETWORK, skipping API connectivity verification process.'));
    return;
  }
  fetch(`${process.env.BACKEND_URL}/api/v3/config`)
  .then(function(response) {
    switch (response.status) {
      case '200': 
        log.success(c.green('The server responded with a 200 code. This is the expected result.'));
        break;
      
    }
    if (response.status !== '200') {
      
    }
    log.info(`The server said: ${c.green(response.statusText)}. Contine.`);
  }).catch(error => {
    log.error(c.red('The server could not be reached or there was an error in the request'));
    log.error(c.red(error));
  });
}

function verifyEnv() {
  if (isCheckDisabled('ENV')) {
    log.info(c.green('USH_DISABLE_CHECKS contains ENV, skipping ENV verification process.'));
    return;
  }
  try {
    fs.accessSync('.env');
  } catch (e) {
    log.error(c.red('.env file not found. Please create the .env file in the project\'s root directory.'));
  }

  if (!process.env.BACKEND_URL) {
    log.error(
      c.red('BACKEND_URL not found in .env file. ' + 
            'Please add this URL to the .env file to connect to the Ushahidi platform server.'
          )
      );
  }
  if (process.env.BACKEND_URL && !isUrl(process.env.BACKEND_URL)) {
    log.error(
      c.red('BACKEND_URL found in .env file. Is not a valid URL.' + 
            'Please fix the API endpoint URL in the .env file to connect to the Ushahidi platform server.'
          )
      );
  }
}
function verifyTransifex() {
  
  if (isCheckDisabled('TRANSIFEX')) {
    log.info(c.green('USH_DISABLE_CHECKS contains TRANSIFEX, skipping TRANSIFEX verification process.'));
    return;
  }
  if (!process.env.TX_USERNAME || !process.env.TX_PASSWORD) {
    log.warn(
      c.yellow('TX_USERNAME and TX_PASSWORD not found in .env file.' +
                    'This might be ok if you are only using English, ' +
                    'but it will not allow you to use any other languages.'
                  )
    );
    log.warn(
      c.yellow('If you need languages other than English, you will need to create a transifex account ' + 
              'and setup the TX_USERNAME and TX_PASSWORD variables in the .env file')
    );
  }

}

function isCheckDisabled(name) {
  if (!process.env.USH_DISABLE_CHECKS) {
    return false;
  }
  const checks = process.env.USH_DISABLE_CHECKS.split(',');
  return checks.indexOf(name) >= 0;
}