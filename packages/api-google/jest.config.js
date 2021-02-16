const base = require('../../jest.config.base');

const packageName = '@arvinxu/translator-google';

const root = '<rootDir>/packages/api-google';

module.exports = {
  ...base,
  rootDir: '../..',
  roots: [root],
  name: packageName,
  displayName: packageName,
};
