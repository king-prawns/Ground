const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const base = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = merge(base, {
  mode: 'production',
  // devtool : 'source-map', // remove this comment if you want JS source maps
  output: {
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/',
    filename: '[chunkhash].app.js'
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    },
    minimizer: [
      new TerserPlugin({
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /(\.css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              sourceMap: true,
              importLoaders: 2
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[chunkhash].app.css'
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../../dist/index.html'),
      template: path.resolve(__dirname, '../../src/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true)
    })
  ]
});
