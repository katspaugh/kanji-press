const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  cache: true,
  debug: true,

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

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
