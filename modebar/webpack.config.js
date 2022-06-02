const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "ushahidi",
    projectName: "modebar",
    webpackConfigEnv,
    argv,
  });
  let filename = defaultConfig.mode === 'development' ? 'ushahidi-modebar.js' : 'ushahidi-modebar.[chunkhash].js';

  return merge(defaultConfig, {
    output: {
      filename,
      clean: true
  }  });
};
