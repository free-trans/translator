const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  moduleNameMapper: {
    '@arvinxu/languages': '<rootDir>/packages/languages/src',
    '@arvinxu/translator': '<rootDir>/packages/translator/src',
  },
  rootDir: path.resolve(__dirname, './'),
};
