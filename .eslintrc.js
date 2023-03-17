module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "semi": [2, "never"],
    "quotes": [2, "single", { "avoidEscape": true }]
  }
}
