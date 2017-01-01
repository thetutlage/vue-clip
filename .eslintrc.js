module.exports = {
  plugins: ['html'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  globals: {
    describe: true,
    it: true,
    beforeEach: true,
    before: true
  },
  extends: 'standard',
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0
  }
}
