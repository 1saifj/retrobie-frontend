const webpack = require(`webpack`);

exports.onCreateWebpackConfig = ({actions, plugins}) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    resolve: {
      fallback: {
        fs: false,
        path: require.resolve('path-browserify'),
      },
    },
  });
};
