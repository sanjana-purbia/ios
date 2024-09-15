module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          test: './test',
          underscore: 'lodash',
          '@src': './src',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@utility': './src/utility',
          '@screens': './src/screens',
          '@config': './src/config',
          '@network': './src/network',
          '@assets': './src/assets',
          '@theme': './src/theme',
          '@constants': './src/constants',
          '@storage': './src/storage',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        blacklist: null, // DEPRECATED
        whitelist: null, // DEPRECATED
        safe: false,
        allowUndefined: false,
        verbose: false,
      },
    ],
  ],
};
