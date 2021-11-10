var path = require("path");
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (webpackConfigEnv, argv) => {
    const orgName = "ushahidi";
    const defaultConfig = singleSpaDefaults({
        orgName,
        projectName: "root-config",
        webpackConfigEnv,
        argv,
        disableHtmlGeneration: true,
    });
    let filename = defaultConfig.mode === 'development' ? 'ushahidi-root-config.js' : 'ushahidi-root-config.[chunkhash].js';


    return merge(defaultConfig, {
        devServer: {
            hot: false,
            static: "./src",
        },
        output: {
            filename,
            clean: true
        },
        module: {
            rules: [
                {
                    test: /\.woff/,
                    use: "url-loader?limit=10000",
                },
                {
                    test: /\.ttf|\.eot/,
                    use: "file-loader",
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                template: "src/index.ejs",
                templateParameters: {
                    isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
                    orgName,
                },
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "src/config.js"),
                    },
                    {
                        from: path.resolve(__dirname, "src/importmap.json"),
                    }

                ],
            }),
        ],
    });
};
