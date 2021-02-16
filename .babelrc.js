const path = require('path');

const root = path.join(__dirname, 'packages');
module.exports = (api) => {
  api.cache(true);
  api.assertVersion('^7.9.0');

  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      [
        '@babel/preset-typescript',
        {
          allowDeclareFields: true,
          onlyRemoveTypeImports: true,
        },
      ],
      // '@umijs/babel-preset-umi',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      [
        'module-resolver',
        {
          root: [root],
          alias: {
            '@arvinxu/translator': path.join(root, './translator/src/index.ts'),
            '@arvinxu/languages': path.join(root, './languages/src/index.ts'),
          },
        },
      ],
    ],
  };
};
