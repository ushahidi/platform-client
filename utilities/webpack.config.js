const { merge } = require("webpack-merge");
const webpack = require("webpack");
const singleSpaDefaults = require("webpack-config-single-spa");

module.exports = (webpackConfigEnv, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName: "ushahidi",
        projectName: "utilities",
        webpackConfigEnv,
    });

    return merge(defaultConfig, {
        plugins: [
            new webpack.DefinePlugin({
                BACKEND_URL: JSON.stringify(
                    process.env.BACKEND_URL || "http://backend.url.undefined"
                ),
            }),
        ],
    });
};
