var webpack = require('webpack');
var path    = require('path');
var config  = require('./webpack.config');

config.output = {
  filename: '[name].[chunkhash].bundle.js',
  chunkFilename: "[name].[chunkhash].bundle.js",
  publicPath: '',
  path: path.resolve(__dirname, 'dist')
};

config.plugins = config.plugins.concat([

  new webpack.DefinePlugin({
    BACKEND_URL: JSON.stringify('http://backend.url.undefined')
  }),

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
