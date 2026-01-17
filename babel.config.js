/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.js',
          '.cjs',
          '.mjs',
          '.jsx',
          '.ts',
          '.cts',
          '.mts',
          '.tsx',
          '.json',
        ],
        alias: {
          '@components': './src/components',
          '@database': './src/database',
          '@hooks': './src/hooks',
          '@locale': './src/locale',
          '@modules': './src/modules',
          '@routes': './src/routes',
          '@screens': './src/screens',
          '@services': './src/services',
          '@theme': './src/theme',
          '@utils': './src/utils',
        },
      },
    ],
  ],
  env: {
    production: {
      plugins: [
        'transform-remove-console',
        'react-native-paper/babel',
      ],
    },
  },
}
