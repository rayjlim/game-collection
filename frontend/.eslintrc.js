module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'comma-dangle': false,
    'react/forbid-prop-types': 0,
    'arrow-parens': [2, 'as-needed'],
    'no-alert': 'off',
    'no-console': 'off',
    'prefer-rest-params': 'off',
    quotes: [2, 'single', { avoidEscape: true }],
    'jsx-a11y/label-has-associated-control': 'off',
    'no-plusplus': 'off',
  },
};
