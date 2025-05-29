/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["eslint-config-prettier"],
  plugins: ['simple-import-sort', 'prettier'],
  rules: {
    'simple-import-sort/imports' : 'error'
  }
}