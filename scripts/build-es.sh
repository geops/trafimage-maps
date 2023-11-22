#!/bin/bash

###
# This script build a folder you can use via import es6 module.
###

# Remove the old files.
if rm -rf build/es; then
  echo "Build folder emptied."
else
  echo "Empty build/es folder failed."
  exit 1
fi

# Transform all es6 files to es5.
# Transform jsx to js.
# Transform .scss import to .css import.
# Creates also js sourcemaps.
if NODE_ENV=production ./node_modules/.bin/babel src --config-file './packages/es/.babelrc' --out-dir build/es --source-maps --copy-files; then
# if NODE_ENV=production yarn esbuild; then
  echo "Transformation suceeds."
else
  echo "Compile the 'src' directory failed."
  exit 1
fi

# Remove all tests files.
if find build/es -regextype posix-extended -regex '.*(test).*js.?(map|snap)?$' -type f | xargs rm -f; then
  echo "All test files removed."
else
  echo "Remove tests files failed."
  exit 1
fi

# Move the index.js file to build/es
cp -f packages/es/index.js build/es
