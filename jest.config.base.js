const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '@arvinxu/languages': '<rootDir>/packages/languages/src',
    '@arvinxu/translator': '<rootDir>/packages/translator/src',
    '@arvinxu/translator-baidu': '<rootDir>/packages/api-baidu/src',
  },
  rootDir: path.resolve(__dirname, './'),
};
