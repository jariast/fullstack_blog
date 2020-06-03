const chalk = require('chalk');

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};
const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(chalk.red(...params));
  }
};

module.exports = {
  info,
  error,
};
