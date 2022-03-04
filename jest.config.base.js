const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  setupFiles: [path.join(__dirname, './tests/setup')],
  setupFilesAfterEnv: [path.join(__dirname, './tests/timeout')],
  moduleNameMapper: {
    '@arvinxu/languages': '<rootDir>/packages/languages/src',
    '@arvinxu/translator': '<rootDir>/packages/translator/src',
    '@arvinxu/translator-baidu': '<rootDir>/packages/api-baidu/src',
  },

  rootDir: path.resolve(__dirname, './'),
};
