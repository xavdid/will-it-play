// default rule changes
// this is handled by prettier
// '@typescript-eslint/space-before-function-paren': 0,
// this is annoying for variables that are X | undefined
// '@typescript-eslint/strict-boolean-expressions': 0
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: ['standard-with-typescript', 'plugin:jest/recommended', 'prettier'],
  parserOptions: { project: './tsconfig.json' },
  rules: {
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
  },
}
