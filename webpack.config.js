'use strict';

module.exports = {
  context: __dirname + '/src',
  entry: './main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.min.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
