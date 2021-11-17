const webpack = require("webpack");
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");

module.exports = (webpackConfigEnv, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName: "ushahidi",
        projectName: "api",
        webpackConfigEnv,
        argv,
    });
    let filename = defaultConfig.mode === 'development' ? 'ushahidi-api.js' : 'ushahidi-api.[chunkhash].js';

    return merge(defaultConfig, {
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
