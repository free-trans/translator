const base = require('../../.babelrc');

module.exports = {
  ...base,
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-flow-strip-types',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@arvinxu/translator': './src',
        },
      },
    ],
  ],
};
