import { createJsWithBabelPreset } from 'ts-jest';

const { CI } = process.env;

// https://kulshekhar.github.io/ts-jest/docs/getting-started/presets/#createjswithbabelesmpresetoptions
const presetConfig = createJsWithBabelPreset({
  babelConfig: '<rootDir>/babel.config.json',
});

/** @type { import('ts-jest').JestConfigWithTsJest } */
const jestConfig = {
  ...presetConfig,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(svg)$': '<rootDir>/.empty_module.mjs',
    'svelte-json-tree-auto':
      '<rootDir>/src/client/debug/tests/JSONTree.mock.svelte',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/client/transport/dummy',
    'src/client/debug/.*',
    'src/types.ts',
  ],
  reporters: [
    ...(CI ? [['github-actions', { silent: false }], 'summary'] : ['default']),
    ['jest-junit', { outputDirectory: 'reports', outputName: 'report.xml' }],
  ],
  setupFiles: ['raf/polyfill', 'jest-date-mock'],
  setupFilesAfterEnv: ['<rootDir>/.jest.setup.js'],
  transform: {
    '^.+\\.svelte$': 'jest-transform-svelte',
    ...presetConfig.transform,
  },
  transformIgnorePatterns: [
    '<rootDir>/.babelrc.mjs',
    'node_modules/(?!(boardgame.io|flatted|svelte-icons)/)',
  ],
  testPathIgnorePatterns: [
    '.husky/',
    '.npm/',
    'examples/',
    'integration/',
    'node_modules/',
  ],
};

export default jestConfig;
