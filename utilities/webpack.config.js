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
