const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const config = require('./webpack.dev.conf');

const {log} = console;

const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8081;
const options = {
  host: DEFAULT_HOST,
  port: DEFAULT_PORT,
  compress: true,
  static: {
    directory: path.resolve(__dirname, '../src')
  }
};

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, options);

log(chalk.cyan('Starting the dev web server...'));
server.listen(DEFAULT_PORT, DEFAULT_HOST, err => {
  if (err) {
    log(chalk.red(err));
  }
  log(
    `${chalk.green(
      'WebpackDevServer listening at localhost:'
    )} ${chalk.underline.green(DEFAULT_PORT)}`
  );
});
