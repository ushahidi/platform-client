var webpack = require('webpack');
var path    = require('path');
var config  = require('./webpack.config');

var publicPath = process.env.ASSETS_DOMAIN || '/';
// ensure publicPath ends in '/'
publicPath = publicPath + (publicPath.slice(-1) !== '/' ? '/' : '');

config.output = {
  filename: '[name].[chunkhash].js',
  chunkFilename: '[name].[chunkhash].js',
  publicPath: publicPath,
  path: path.resolve(__dirname, 'server/www') // Overwritten by gulp
};

config.plugins = config.plugins.concat([

  // Reduces bundles total size
  new webpack.optimize.UglifyJsPlugin({
    mangle: {

      // You can specify all variables that should not be mangled.
      // For example if your vendor dependency doesn't use modules
      // and relies on global variables. Most of angular modules relies on
      // angular global variable, so we should keep it unchanged
      except: ['$super', '$', 'exports', 'require', 'angular']
    }
  })
]);

module.exports = config;
