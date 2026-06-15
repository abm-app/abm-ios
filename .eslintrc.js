module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-native', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ── Design-system enforcement ──────────────────────────────────────────

    // Prevent hardcoded color literals (hex, rgb, rgba) in source code.
    // Tokens.ts is exempted via overrides below.
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
        message:
          'Hardcoded hex color found. Use a token from src/theme/tokens.ts instead.',
      },
      {
        selector: "Literal[value=/^rgba?\\(/]",
        message:
          'Hardcoded RGB/RGBA color found. Use a token from src/theme/tokens.ts instead.',
      },
    ],

    // Prevent inline style objects in JSX — use StyleSheet.create() instead.
    'react-native/no-inline-styles': 'error',
  },
  overrides: [
    {
      files: ['src/theme/tokens.ts'],
      rules: {
        'no-restricted-syntax': 'off',
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
  settings: {
    react: { version: 'detect' },
  },
};
