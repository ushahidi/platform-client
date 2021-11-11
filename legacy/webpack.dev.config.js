var config  = require('./webpack.config');

config.mode = 'development';

config.devtool = 'sourcemap'

config.devServer = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  stats: 'errors-only'
}

// this is modules imported using require inside the code (for example dayjs),
// needed for proxy in dev-environment
config.output.chunkFilename = 'legacy-modules/[name].js'

module.exports = config;
