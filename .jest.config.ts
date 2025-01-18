import type { JestConfigWithTsJest } from 'ts-jest';
import { createJsWithBabelEsmPreset } from 'ts-jest';

const { CI } = process.env;

// https://kulshekhar.github.io/ts-jest/docs/getting-started/presets/#createjswithbabelesmpresetoptions
const presetConfig = createJsWithBabelEsmPreset({
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
  extensionsToTreatAsEsm: [...presetConfig.extensionsToTreatAsEsm, '.svelte'],
  moduleFileExtensions: ['js', 'svelte', 'ts', 'tsx'],
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
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    ...presetConfig.transform,
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }],
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/.pnpm/(?!(boardgame.io|esm-env|flatted|nanoid|svelte|@testing-library\\+svelte)@)',
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
