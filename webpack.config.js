const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './public/project/application.js',
    './public/sw.js'
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist')
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'public/dist')
  },

  target: 'node',
  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: '/\.js?$/',
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }]
  },

  resolve: {
    extensions: ['*', '.js']
  },
};