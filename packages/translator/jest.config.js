const base = require('../../jest.config.base');
const packageName = '@arvinxu/translator';

const root = '<rootDir>/packages/translator';

module.exports = {
  ...base,
  rootDir: '../..',
  roots: [root],
  name: packageName,
  displayName: packageName,
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
  },
};
