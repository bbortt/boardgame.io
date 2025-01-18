/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import svelte from 'rollup-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
const subpackages = require('./subpackages');

const internalDeps = new Set(['svelte']);
const external = [
  ...Object.keys(pkg.dependencies).filter((name) => !internalDeps.has(name)),
  'react',
  'socket.io-client',
];

const plugins = (outDir) => [
  babel({ exclude: '**/node_modules/**' }),
  resolve({ browser: true, only: [/svelte/] }),
  typescript({
    compilerOptions: {
      declaration: true,
      declarationDir: outDir + '/types',
    },
  }),
  svelte({ extensions: ['.svelte'], preprocess: sveltePreprocess() }),
];

const serverPlugins = [
  resolve(),
  typescript(),
  babel({ exclude: ['**/node_modules/**'] }),
  commonjs({ include: 'node_modules/**' }),
];

const minifiedPlugins = [
  babel({ exclude: '**/node_modules/**' }),
  resolve({ browser: true }),
  typescript(),
  svelte({ extensions: ['.svelte'], preprocess: sveltePreprocess() }),
  commonjs(),
  replace({
    include: 'src/**',
    'process.env.NODE_ENV': JSON.stringify('development'),
  }),
  replace({
    exclude: 'src/**',
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  filesize(),
  terser(),
];

export default [
  // Subpackages: CJS.
  {
    input: subpackages.reduce((obj, name) => {
      obj[name] = `packages/${name}.ts`;
      return obj;
    }, {}),
    external,
    plugins: plugins('dist/cjs'),
    output: [
      {
        dir: 'dist/cjs',
        format: 'cjs',
      },
    ],
  },

  // Subpackages: ESM.
  {
    input: subpackages.reduce((obj, name) => {
      obj[name] = `packages/${name}.ts`;
      return obj;
    }, {}),
    external,
    plugins: plugins('dist/esm'),
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
      },
    ],
  },

  // Server.
  {
    input: 'packages/server.ts',
    output: { dir: 'dist/cjs', format: 'cjs' },
    external,
    plugins: serverPlugins,
  },

  // CJS and ES versions.
  // The subpackages are the preferred way of importing
  // stuff from the library instead of these.
  {
    input: 'packages/main.js',
    external,
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'esm' },
    ],
    plugins: plugins('dist'),
  },

  // Browser minified version.
  {
    input: 'packages/client.ts',
    output: [
      {
        file: pkg.unpkg,
        format: 'umd',
        name: 'BoardgameIO',
      },
    ],
    plugins: minifiedPlugins,
  },
];
