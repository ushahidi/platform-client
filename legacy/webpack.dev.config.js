var config  = require('./webpack.config');

config.mode = 'development';

config.devtool = 'sourcemap'

config.devServer = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  stats: 'errors-only',
  writeToDisk: true

}
// this is modules required within the code (for example dayjs),
// needed for proxy in dev-environment
config.output.chunkFilename = 'legacy-modules/[name].js'

 
module.exports = config;
