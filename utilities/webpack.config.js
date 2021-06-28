const { merge } = require("webpack-merge");
const webpack = require("webpack");
const dotenv = require("dotenv");
const singleSpaDefaults = require("webpack-config-single-spa");
dotenv.config({ silent: true });

module.exports = (webpackConfigEnv, argv) => {
    console.log(webpackConfigEnv);
    console.log(argv);

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
