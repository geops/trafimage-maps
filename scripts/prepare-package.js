const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

const buildDir = path.resolve(__dirname, "../build/");

// Write out simplified package.json to be able to publish only the build
// folder content.
delete pkg.scripts;
delete pkg.devDependencies;
delete pkg.style;
delete pkg.eslintConfig;
delete pkg.private;
delete pkg.dependencies["react-styleguidist"];

// Write the good index file import for es6 module loading.
pkg.main = "bundle.js";
fs.writeFileSync(
  path.join(buildDir, "package.json"),
  JSON.stringify(pkg, null, 2),
  "utf-8",
);
