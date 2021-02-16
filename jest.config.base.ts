import path from 'path';
import type { Config } from '@jest/types';

const baseConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  transform: {
    '^.[jt]sx?$': 'ts-jest',
  },

  testRegex: '(/tests/.*.(test|spec)).tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'json', 'node'],
  verbose: true,
  moduleNameMapper: {
    '@arvinxu/languages': '<rootDir>/packages/languages/src',
    '@arvinxu/translator': '<rootDir>/packages/translator/src',
  },
  rootDir: path.resolve(__dirname, './'),
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};

export default baseConfig;
