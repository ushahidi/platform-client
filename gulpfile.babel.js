'use strict';

import gulp     from 'gulp';
import webpack  from 'webpack';
import path     from 'path';
import sync     from 'run-sequence';
import rename   from 'gulp-rename';
import template from 'gulp-template';
import fs       from 'fs';
import yargs    from 'yargs';
import lodash   from 'lodash';
import gutil    from 'gulp-util';
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

let root = 'app';

// Load .env file
dotenv.config({silent: true});
// Grab backend-url from gulp options
process.env.BACKEND_URL = gutil.env['backend-url'] || process.env.BACKEND_URL;

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
  dest: path.join(__dirname, 'dist')
};

// use webpack.config.js to build modules
gulp.task('dist', (cb) => {
    return sync('clean', ['dist-webpack', 'dist-config', 'transifex-download'], cb);
});

// Copy config.js into dist
gulp.task('dist-config', (cb) => {
    return gulp.src(paths.config)
        .pipe(gulp.dest(paths.dest));
});

// Build webpack for production
gulp.task('dist-webpack', (cb) => {
  const config = require('./webpack.dist.config');
  config.entry.app = paths.entry;

  webpack(config, (err, stats) => {
    if(err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
});

gulp.task('build', ['dist']);

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

/*gulp.task('component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(paths.blankTemplates)
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});*/

gulp.task('clean', (cb) => {
  del([paths.dest]).then(function (paths) {
    gutil.log("[clean]", paths);
    cb();
  })
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
 * Task `release` - Build release
 */
gulp.task('transifex-download', require('./gulp/transifex-download'));

/**
 * Task `heroku:dev` - builds app for heroku
 */
gulp.task('heroku:dev', ['dist']);

/**
 * Task `tar` - Build tarball for release
 * Options
 * `--version-suffix=<version>` - Specify version for output fil
 */
gulp.task('tar', () => {
    var version = gutil.env['version-suffix'] || require('./package.json').version;
    var dest_dir = gutil.env['dest-dir'] || 'build';

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
    return sync('dist', 'tar', done);
});

gulp.task('default', ['watch']);
