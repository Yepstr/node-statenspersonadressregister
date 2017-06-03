module.exports = {
  'plugins': [
    'jest'
  ],
  'extends': [
    '@yepstr/eslint-config-yepstr/common',
    '@yepstr/eslint-config-yepstr/node',
  ],
  'env': {
    'jest/globals': true,
  },
};
