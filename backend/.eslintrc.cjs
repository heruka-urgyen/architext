module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
      "no-unused-vars": [2, {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false,
        varsIgnorePattern: "_",
        argsIgnorePattern: "_",
      }],
    }
}
