const path = require('path');
const webpack = require('webpack');

var isProd = (process.env.NODE_ENV == 'production');

module.exports = {
  devtool: 'cheap-module-source-map',
  cache: true,
  debug: !isProd,

  entry: path.resolve(__dirname, 'src/index.jsx'),

  output: {
    path: path.resolve(__dirname),
    filename: 'app.js'
  },

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loaders: [
          'babel?cacheDirectory',
        ],
        include: [
          path.resolve(__dirname, 'src')
        ]
      },
      { test: /\.json$/, loader: 'json' }
    ]
  },

  plugins: isProd ? [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ] : []
};
