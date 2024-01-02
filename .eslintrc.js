module.exports = {
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "eslint-plugin-tsdoc"
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: "module"
  },
  ignorePatterns: [".eslintrc.js", "./bin/*"],
  rules: {
    "tsdoc/syntax": "error",
    "indent":['error', 2],
    "@typescript-eslint/no-explicit-any": ['off']
  }
};