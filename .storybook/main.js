const webpackConfigOverrides = require('../config-overrides');

module.exports = {
  "stories": [
    "../src/**/*.stories.@(js|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
  ],
  webpackFinal: async (config, { configType }) => {
    config.node = {
      ...config.node,
      fs: 'empty',
    };
    return webpackConfigOverrides(config);
  },
}