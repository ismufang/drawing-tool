module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [1],
    '@typescript-eslint/no-unused-expressions': ['off'],
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'no-unneeded-ternary': 'off',
    'consistent-return': 'off',
    'no-return-assign': 'off',
    'prefer-template': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'prefer-destructuring': 'warn',
    '@typescript-eslint/no-shadow': 'off',
    'no-underscore-dangle': 'off',
  },
}
