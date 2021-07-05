var webpack = require('webpack');
var path = require('path');
var config = require('./webpack.config');

config.mode = 'production';

config.output = {
    chunkFilename: '[name].js',
    publicPath: '',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system'
};


config.stats = 'none';

module.exports = config;
