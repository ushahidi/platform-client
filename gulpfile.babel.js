'use strict';

import gulp     from 'gulp';
import webpack  from 'webpack';
import path     from 'path';
import runSeq   from 'run-sequence';
import rename   from 'gulp-rename';
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
import fs        from 'fs';

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
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
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
    gutil.log('[clean]', paths);
    done();
  });
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
 * Task `release` - Build release
 */
gulp.task('transifex-download', function (done) {
    let destination = gutil.env.dev ? path.join(__dirname, root) : paths.dest;

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
    return runSeq('dist', 'tar', done);
});

gulp.task('default', ['watch']);
