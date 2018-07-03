const resolve = require('../webpack/resolve.js')

module.exports = {
  resolve: {
    alias: resolve.alias,
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: '[name]_[hash]',
              runtimeCompat: false,
              prefixize: true,
            },
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
              ],
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png)$/i,
        loader: 'file-loader',
        options: {
          hash: 'sha512',
          digest: 'hex',
          name: '[hash].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          }
        ],
      },
      {
          test: /\.scss$/,
          include: [/node_modules/, /components\/utils/],
          use: [
              {
                loader: 'style-loader',
              },
                  {
                      loader: 'css-loader',
                      options: {
                          modules: false,
                          sourceMap: true,
                      }
                  },
                  {
                      loader: 'sass-loader'
                  }
              ]
      },
      {
          test: /\.scss$/,
          exclude: [/node_modules/, /utils/],
          use: [{
            loader: 'style-loader',
          },
                  {
                      loader: 'css-loader',
                      options: {
                          modules: true,
                          sourceMap: true,
                          importLoaders: 2,
                          localIdentName: '[name]__[local]___[hash:base64:5]'
                      }
                  },
                  {
                      loader: 'sass-loader'
                  }
              ]
      },
    ],
  },

}
