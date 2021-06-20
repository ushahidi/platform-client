var path    = require('path');
var config  = require('./webpack.config');

config.mode = 'development';

config.output = {
//TODO check how to add name dynamically to single-spa
  filename: 'ushahidi-legacy-app.dev.js',
  path: path.resolve(__dirname, 'dist'),
  libraryTarget: 'system'
};

config.devtool = 'sourcemap'

config.devServer = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
}
module.exports = config;
