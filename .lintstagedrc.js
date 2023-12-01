const lintStaged = {
  "*.md": ["prettier --write"],
  "src/lang/*.json": ["yarn sort", "git add"],
  "(src|__mocks__)/**/*.js": [
    "eslint --fix",
    "prettier --write",
    "git add",
    "yarn test --bail --findRelatedTests",
  ],
  "src/**/*.scss": ["stylelint --fix", "git add"],
  "package.json": ["yarn fixpack", "git add"],
};
module.exports = lintStaged;
