const pjson = require("../package.json");

const { peerDependencies } = pjson;

const packageKeys = Object.keys(peerDependencies || {});

const arg = process.argv[2];

if (arg === "add" && packageKeys.length > 0) {
  console.log(
    `yarn add ${packageKeys
      .map((p) => `${p}@${peerDependencies[p]}`)
      .join(" ")}`,
  );
} else if (arg === "remove" && packageKeys.length > 0) {
  console.log(
    `rm -rf ${packageKeys.map((p) => `node_modules/${p}`).join(" ")}`,
  );
} else {
  console.log('echo "wrong argument."');
}
