const chalk = require('chalk');

const info = (...params) => console.log(...params);
const error = (...params) => console.error(chalk.red(...params));

module.exports = {
  info,
  error,
};
