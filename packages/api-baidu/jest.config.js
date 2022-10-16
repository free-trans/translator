const base = require('../../jest.config.base');

const packageName = '@arvinxu/translator-baidu';

const root = '<rootDir>/packages/api-baidu';

module.exports = {
  ...base,
  rootDir: '../..',
  roots: [root],
  displayName: packageName,
};
