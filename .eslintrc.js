const { builders } = require('../../eslint-base-config');

const mainConfig = {
  root: true,
  ...builders.base(),
  overrides: [],
};
mainConfig.extends = [
  ...mainConfig.extends,
  'plugin:oxlint/recommended',
];

mainConfig.overrides.push({
  files: ['*.json'],
  ...builders.json(),
});

const reactConfig = builders.reactTypescript({
  baseDir: __dirname,
});
reactConfig.overrides = [
  {
    files: ['src/**/__tests__/**'],
    ...builders.reactTests(),
  },
];

mainConfig.overrides.push({
  files: ['*.ts', '*.tsx'],
  ...reactConfig,
});

module.exports = mainConfig;
