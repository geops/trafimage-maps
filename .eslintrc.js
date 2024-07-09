const eslintConfig = {
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
    "cypress/globals": true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    jsx: true,
    impliedStrict: true,
  },
  extends: ["airbnb", "airbnb/hooks", "prettier"],
  plugins: ["cypress", "prettier"],
  rules: {
    "linebreak-style": 0,
    "arrow-body-style": 0,
    "default-param-last": 0,
    "no-restricted-exports": 0,
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"],
      },
    ],
    "react/forbid-prop-types": "Off",
    "react/jsx-props-no-spreading": "Off",
    "react/require-default-props": "Off",
    "prettier/prettier": "error",
    "react/require-default-props": "Off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

module.exports = eslintConfig;
