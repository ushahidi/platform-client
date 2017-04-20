var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var imgPath = path.resolve('node_modules/ushahidi-platform-pattern-library/assets/');

var extractCss = new ExtractTextPlugin('[name].[chunkhash].bundle.css');

module.exports = {
  devtool: 'source-map',
  entry: {},
  module: {
    loaders: [
       { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel' },
       { test: /\.html$/, loader: 'html?attrs[]=img:src&attrs[]=use:xlink:href&attrs[]=link:href&root='+imgPath },
       { test: /\.scss$/, loader: extractCss.extract('style', 'css!resolve-url!sass?sourceMap') },
       { test: /\.css$/, loader: extractCss.extract('style', 'css') },
       { test: /\.png/, loader: 'url?limit=10000' },
       { test: /\.svg/, loader: 'svg-url?limit=1' },
       { test: /\.woff/, loader: 'url?limit=10000' },
       { test: /\.ttf|\.eot/, loader: 'file' },
       { test: /\.json$/, exclude:[/manifest.json$/],loader: 'json' },
       { test: /manifest.json$/, loader: 'file-loader?name=manifest.json!web-app-manifest-loader' }
    ]
  },
  plugins: [
    extractCss,

    // Skip locales
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(process.env.BACKEND_URL || 'http://backend.url.undefined')
    }),

    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body',
      hash: false
    }),

    // Automatically move all modules defined outside of application directory and pattern library
    // to vendor bundle. If you are using more complicated project structure, consider to specify
    // common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource &&
            module.resource.indexOf(path.resolve(__dirname, 'app')) === -1 &&
            module.resource.indexOf('ushahidi-platform-pattern-library') === -1;
      }
    })
  ]
};
