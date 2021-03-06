module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: [
    "react",
    "jest",
  ],
  rules: {
    "react/display-name": 0,
    "react/prop-types": 0,
    quotes: [2, "double"],
    "no-unused-vars": [2, {
      vars: "all",
      args: "after-used",
      ignoreRestSiblings: false,
      varsIgnorePattern: "_",
      argsIgnorePattern: "_",
    }],
    "jest/no-disabled-tests": 1,
    "jest/no-identical-title": 2,
  },
}
