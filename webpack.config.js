const path = require('path');
const argv = require('yargs').argv;
const nodeExternals = require('webpack-node-externals');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;
const distPath = path.join(__dirname, 'public/dist');

module.exports = {
  entry: [
    './public/project/application.js',
    './public/webpack_entries.js',
    './public/sw.js'
  ],

  output: {
    filename: 'bundle.js',
    path: distPath
  },

  devServer: {
    contentBase: distPath
  },

  target: 'web',
  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: '/\.js?$/',
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env'],
          plugins: [
            'transform-runtime',
            'transform-async-to-generator'
          ]
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                url: true,
                minimize: isProduction,
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(eot|woff2|woff|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
        }
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css',
    })
  ],

  resolve: {
    extensions: ['*', '.js']
  },
};