import { createJsWithBabelPreset } from 'ts-jest';
import type { JestConfigWithTsJest } from 'ts-jest';
import { sveltePreprocess } from 'svelte-preprocess';

const { CI } = process.env;

// https://kulshekhar.github.io/ts-jest/docs/getting-started/presets/#createjswithbabelesmpresetoptions
const presetConfig = createJsWithBabelPreset({
  babelConfig: '<rootDir>/babel.config.json',
});

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/client/transport/dummy',
    'src/client/debug/.*',
    'src/types.ts',
  ],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(svg)$': '<rootDir>/.empty_module.js',
    'svelte-json-tree-auto':
      '<rootDir>/src/client/debug/tests/JSONTree.mock.svelte',
  },
  reporters: [
    // @ts-expect-error - type incompatibility
    ...(CI ? [['github-actions', { silent: false }], 'summary'] : ['default']),
    // @ts-expect-error - type incompatibility
    ['jest-junit', { outputDirectory: 'reports', outputName: 'report.xml' }],
  ],
  setupFiles: ['raf/polyfill', 'jest-date-mock'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.svelte$': [
      'jest-transform-svelte',
      { preprocess: sveltePreprocess() },
    ],
    ...presetConfig.transform,
  },
  transformIgnorePatterns: ['node_modules/(?!(boardgame.io|flatted)/)'],
  testPathIgnorePatterns: [
    '.husky/',
    '.npm/',
    'examples/',
    'integration/',
    'node_modules/',
  ],
};

export default jestConfig;
