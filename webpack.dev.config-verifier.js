var webpack = require('webpack');
var path    = require('path');
var config  = require('./webpack.config-verifier');

config.output = {
  filename: '[name].js',
  chunkFilename: '[name].js',
  publicPath: '/',
  path: path.resolve(__dirname, 'verifier')
};

config.plugins = config.plugins.concat([

  // Adds webpack HMR support. It act's like livereload,
  // reloading page after webpack rebuilt modules.
  // It also updates stylesheets and inline assets without page reloading.
  new webpack.HotModuleReplacementPlugin()
]);

module.exports = config;
