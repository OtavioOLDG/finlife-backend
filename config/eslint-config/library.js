/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ['simple-import-sort', 'prettier'],
  rules: {
    'simple-import-sort/imports' : 'error'
  }
}