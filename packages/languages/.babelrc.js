const base = require('../../.babelrc');

module.exports = {
  ...base,
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@arvinxu/languages': './src',
        },
      },
    ],
  ],
};
