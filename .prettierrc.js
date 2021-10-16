const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  // 使用分号, 默认true
  semi: false,
  overrides: [
    {
      files: '.prettierrc',
      options: { parser: 'json' },
    },
  ],
}
