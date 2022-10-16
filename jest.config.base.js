const { createConfig } = require('@umijs/test');
const path = require('path');

const config = createConfig({
  target: 'node',
  jsTransformer: 'esbuild',
});

module.exports = {
  ...config,
  verbose: true,
  setupFiles: [...config.setupFiles, path.join(__dirname, './tests/setup')],
  setupFilesAfterEnv: [path.join(__dirname, './tests/timeout')],
  moduleNameMapper: {
    ...config.moduleNameMapper,
    '@arvinxu/languages': '<rootDir>/packages/languages/src',
    '@arvinxu/translator': '<rootDir>/packages/translator/src',
    '@arvinxu/translator-baidu': '<rootDir>/packages/api-baidu/src',
  },
  rootDir: path.resolve(__dirname, './'),
};
