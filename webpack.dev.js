const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
});