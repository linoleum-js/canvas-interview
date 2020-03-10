require('babel-polyfill');

var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
    'main': [
      'babel-polyfill',
      './src/index.js'
    ]
  },
  devServer: {
    contentBase: './public'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.js', '.css']
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
};
