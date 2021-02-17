const base = require('../../jest.config.base');

const packageName = '@arvinxu/translator-tencent';

const root = '<rootDir>/packages/api-tencent';

module.exports = {
  ...base,
  rootDir: '../..',
  roots: [root],
  name: packageName,
  displayName: packageName,
};
