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
import minimist  from 'minimist'; 
import verifier from './gulp/verifier';
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

gulp.task('watch:verifier', () => {
  process.env.VERIFIER = true;
  gulp.run('dev');
});

gulp.task('dev:verifier', () => {
  process.env.VERIFIER = true;
  gulp.run('dev');
});

gulp.task('dev', () => {
  const config = require('./webpack.dev.config');
  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true',
    // application entry point
  ].concat(paths.entry);

  var compiler = webpack(config);

  let denyXFrame = (req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  };
  let allowXFrame = (req, res, next) => {
    res.removeHeader('X-Frame-Options');
    next();
  };

  serve({
    port: process.env.PORT || 3000,
    open: false,
    server: {baseDir: root},
    middleware: [
      denyXFrame,
      {
          route: '/posts',
          handle: allowXFrame
      },
      {
          route: '/views',
          handle: allowXFrame
      },
      {
          route: '/',
          handle: allowXFrame
      },
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

// gulp.task('watch:verify', ['watch:verify']);

gulp.task('verify', () => {
  if (verifier.isCheckDisabled('ALL')) {
    log.info(c.green('USH_DISABLE_CHECKS is ALL, skipping verification process.'));
    return;
  }
  verifier.verifyEnv();
  verifier.verifyTransifex();
  verifier.verifyNetwork();
  verifier.verifyEndpointStatus();
  verifier.verifyEndpointStructure();
  verifier.verifyOauth();
  verifier.verifyDbConnection();
  verifier.verifyAPIEnvs();
});
