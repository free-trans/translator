const base = require('../../jest.config.base');

const packageName = '@arvinxu/translator-youdao';

const root = '<rootDir>/packages/api-youdao';

module.exports = {
  ...base,
  rootDir: '../..',
  roots: [root],
  name: packageName,
  displayName: packageName,
};
