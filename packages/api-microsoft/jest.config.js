const base = require('../../jest.config.base');

const packageName = '@arvinxu/translator-microsoft';

const root = '<rootDir>/packages/api-microsoft';

module.exports = {
  ...base,
  rootDir: '../..',
  roots: [root],
  name: packageName,
  displayName: packageName,
};
