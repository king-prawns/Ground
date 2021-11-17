const path = require('path');
const Dotenv = require('dotenv-webpack');

process.noDeprecation = true;

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {minimize: true}
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'ts-loader'
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [new Dotenv()]
};
