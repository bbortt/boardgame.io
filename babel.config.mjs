export default {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        exclude: ['transform-regenerator', 'transform-async-to-generator'],
      },
    ],
    '@babel/preset-react',
    '@babel/typescript',
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'boardgame.io': './packages',
        },
      },
    ],
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-object-rest-spread',
  ],
};
