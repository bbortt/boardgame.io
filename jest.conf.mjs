/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(svg)$': '<rootDir>/.empty_module.js',
    'svelte-json-tree-auto':
      '<rootDir>/src/client/debug/tests/JSONTree.mock.svelte',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/client/transport/dummy',
    'src/client/debug/.*',
    'src/types.ts',
  ],
  setupFiles: ['raf/polyfill', 'jest-date-mock'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.svelte$': 'jest-transform-svelte',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(boardgame.io|flatted|svelte-icons)/)',
  ],
  testPathIgnorePatterns: [
    'examples/',
    'integration/',
    'node_modules/',
    '.npm/',
  ],
};
