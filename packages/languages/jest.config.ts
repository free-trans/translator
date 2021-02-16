import type { Config } from '@jest/types';
import base from '../../jest.config';

const packageName = '@arvinxu/languages';

const root = '<rootDir>/packages/languages';

const config: Config.InitialOptions = {
  ...base,
  rootDir: '../..',
  roots: [root],
  name: packageName,
  displayName: packageName,
};

export default config;
