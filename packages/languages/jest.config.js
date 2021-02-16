const base = require('../../jest.config.base');

const packageName = '@arvinxu/languages';

const root = '<rootDir>/packages/languages';

module.exports = {
  ...base,
  rootDir: '../..',
  roots: [root],
  name: packageName,
  displayName: packageName,
};
