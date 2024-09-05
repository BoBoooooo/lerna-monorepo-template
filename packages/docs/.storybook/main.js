const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
// https://github.com/tremorlabs/tremor/blob/f46e297c6b553db8f463634c751f3f75efde4bb0/package.json
module.exports = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  framework: "@storybook/react-webpack5",
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-styling-webpack",
      options: {
        rules: [
          {
            test: /\.css$/,
            sideEffects: true,
            use: [
              require.resolve("style-loader"),
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1,
                },
              },
            ],
          },
          {
            test: /\.less$/,
            use: [
              "style-loader",
              "css-loader",
              {
                loader: "less-loader",
                options: {
                  javascriptEnabled: true,
                  math: 'always',
                },
              },
            ],
          },
        ],
      },
    },
    "@storybook/addon-webpack5-compiler-babel",
  ],
  docs: {
    autodocs: "tag",
  },
  typescript: {
    reactDocgen: "react-docgen",
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
          extensions: config.resolve.extensions,
        }),
      ];
    }
    return config;
  },
};
