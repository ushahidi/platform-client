var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var path    = require('path');
var config  = require('./webpack.config');

config.mode = 'production';

config.output = {
  filename: '[name].[chunkhash].js',
  chunkFilename: '[name].[chunkhash].js',
  publicPath: '',
  path: path.resolve(__dirname, 'server/www') // Overwritten by gulp
};

config.optimization.minimize = true;
config.optimization.minimizer = [
  new UglifyJsPlugin({
    cache: true,
    parallel: true,
    sourceMap: true,
    uglifyOptions: {
      mangle: true,
      except: ['$super', '$', 'exports', 'require', 'angular']
    }
  }),
  new OptimizeCSSAssetsPlugin({})]
  config.stats = 'none';


module.exports = config;
