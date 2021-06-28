var webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');
var config = require('./webpack.config');

config.mode = 'production';

config.output = {
    filename: 'ushahidi-legacy-app.js',
    // chunkFilename: '[name].[chunkhash].js',
    publicPath: '',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system'
};

config.optimization = {
    minimize: true,
    minimizer: [
        new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
            terserOptions: {
                mangle: {
                    reserved: ['$super', '$', 'exports', 'require', 'angular']
                }
            }
        }),
        new OptimizeCSSAssetsPlugin({})
    ]
};

config.stats = 'none';

module.exports = config;
