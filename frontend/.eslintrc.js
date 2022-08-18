module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "airbnb-base",
  ],
  overrides: [{
    files: ["*.jsx", "*.js"],
  }],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  plugins: [
    "import",
    "react",
    "react-hooks",
    "jsx-a11y",
    "jest",
  ],
  rules: {
    semi: 0,
    quotes: [2, "double"],
    "no-shadow": 0,
    "no-restricted-syntax": 0,
    "object-curly-spacing": 0,
    "prefer-destructuring": 0,
    "arrow-parens": [2, "as-needed"],
    "function-paren-newline": 0,
    "implicit-arrow-linebreak": 0,
    "no-unused-vars": [2, {
      vars: "all",
      args: "after-used",
      ignoreRestSiblings: false,
      varsIgnorePattern: "_",
      argsIgnorePattern: "_",
    }],
    "import/prefer-default-export": 0,
    "react/display-name": 0,
    "react/prop-types": 0,
    "jest/no-disabled-tests": 1,
    "jest/no-identical-title": 2,
  },
};
