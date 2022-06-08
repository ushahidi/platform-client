const { merge } = require("webpack-merge");
const webpack = require("webpack");
const singleSpaDefaults = require("webpack-config-single-spa");

module.exports = (webpackConfigEnv, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName: "ushahidi",
        projectName: "utilities",
        webpackConfigEnv,
        argv
    });

    let filename = defaultConfig.mode === 'development' ? 'ushahidi-utilities.js' : 'ushahidi-utilities.[chunkhash].js';
    return merge(defaultConfig, {
        module: {
            rules:[
              {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                loader: 'file-loader',
                options: {
                  name: 'utilities/[path][name].[ext]'
                }
              },
                {
                    test: /\.woff/,
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        name: 'utilities/[path][name].[ext]'
                      }
                },
                {
                    test: /\.ttf|\.eot/,
                    loader: "file-loader",
                    options: {
                        name: 'utilities/[path][name].[ext]'
                      }
                }
            ]
          },
        output: {
            filename,
            clean: true
        },
        plugins: [
            new webpack.DefinePlugin({
                BACKEND_URL: JSON.stringify(
                    process.env.BACKEND_URL || "http://backend.url.undefined"
                ),
            }),
        ],
    });
};
