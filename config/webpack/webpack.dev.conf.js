const webpack = require('webpack');
const {merge} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base.conf');
const path = require('path');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'app.js',
    publicPath: '/'
  },
  entry: [
    // Runtime code for hot module replacement
    'webpack/hot/dev-server.js',
    // Dev server client for web socket transport and live reload logic
    'webpack-dev-server/client/index.js?live-reload=true',
    // Your entry
    './src/index.tsx'
  ],
  module: {
    rules: [
      {
        test: /(\.css)$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              sourceMap: true,
              importLoaders: 2
            }
          },
          {
            // resolves relative paths based on the original source file.
            loader: 'resolve-url-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false)
    })
  ]
});
