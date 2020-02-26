var path    = require('path');
var config  = require('./webpack.config');

config.devtool = 'inline-source-map';
config.plugins = [];

// Add root to resolve for easier refs within tests
config.resolve = {
    modules : [
        path.resolve('./'),
        'node_modules'
    ]
};
config.mode = 'development';


module.exports = config;
