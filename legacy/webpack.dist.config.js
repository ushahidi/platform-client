var config = require('./webpack.config');
config.mode = 'production';
config.stats = 'none';
config.output.filename = '[name].[chunkhash].js';

module.exports = config;
