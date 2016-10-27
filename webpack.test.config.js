var path    = require('path');
var config  = require('./webpack.config');

config.devtool = 'inline-source-map';
config.plugins = [];

// Add root to resolve for easier refs within tests
config.resolve = {
    root : [path.resolve('./')]
};

module.exports = config;
