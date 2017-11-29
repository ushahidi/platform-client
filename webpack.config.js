var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var imgPath = path.resolve('node_modules/ushahidi-platform-pattern-library/assets/');

var extractCss = new ExtractTextPlugin('[name].[chunkhash].bundle.css');

module.exports = {
  devtool: 'source-map',
  entry: {'app': [
    'babel-polyfill'
  ]},
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/app\/lib/, /node_modules/],
        use: [
          'ng-annotate-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['es2015', { modules: false }],
                'stage-0'
              ],
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options : {
              attrs : ['img:src','use:xlink:href','link:href'],
              root: imgPath
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
        })
      },
      {
        test: /\.css$/,
        use: extractCss.extract({ fallback: 'style-loader', use: 'css-loader' })
      },
      {
        test: /\.png/,
        use: {
          loader: 'url-loader?limit=10000'
        }
      },
      {
        test: /\.svg/,
        use: 'svg-url-loader?limit=1'
      },
      {
        test: /\.woff/,
        use: 'url-loader?limit=10000'
      },
      {
        test: /\.ttf|\.eot/,
        use: 'file-loader'
      },
      {
        test: /\.json$/,
        exclude: [/manifest.json$/],
        use: 'json-loader'
      },
      {
        test: /manifest.json$/,
        loader: ['file-loader?name=manifest.json', 'web-app-manifest-loader']
      }
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
