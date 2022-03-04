const base = require('../../jest.config.base');

const packageName = '@arvinxu/translator-sogou';

const root = '<rootDir>/packages/api-sogou';

module.exports = {
...base,
rootDir: '../..',
roots: [root],
name: packageName,
displayName: packageName,
};

