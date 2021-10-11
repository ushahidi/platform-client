var webpack = require('webpack');
var path = require('path');
var config = require('./webpack.config');

config.mode = 'production';
config.stats = 'none';

module.exports = config;
