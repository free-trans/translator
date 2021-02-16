import type { Config } from '@jest/types';
import base from '../../jest.config';

const packageName = '@arvinxu/translator';

const root = '<rootDir>/packages/translator';

const config: Config.InitialOptions = {
  ...base,
  rootDir: '../..',
  roots: [root],
  name: packageName,
  displayName: packageName,
};

export default config;
