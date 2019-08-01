#!/bin/bash

###
# This script build creates the documentation page, made with
# styleguidist for the components, and documentation.js.
###

# Remove the old files from doc folder.
if rm -rf doc/*; then
  echo "Documentation folder emptied."
else
  echo "Empty doc folder failed."
  exit 1
fi

# Build styleguidist documentation (based on styleguide.config.js).
if styleguidist build; then
  echo "Styleguidist build suceeds."
else
  echo "Building styleguidist failed."
  exit 1
fi

# Copy images in documentation folder.
if cp -rf src/img/ doc; then
  echo "Copy images in doc folder suceeds."
else
  echo "Copy images in doc folder failed."
  exit 1
fi

# Build jsdoc documentation for layers, in jsdoc folder (based on jsdoc_conf.json).
if node ./scripts/doc.js; then
  echo "jsdoc build suceeds."
else
  echo "Building jsdoc failed."
  exit 1
fi

# Rename jsdoc index.html and move it to /doc
mv docjs/index.html doc/docjs.html
mv docjs/* doc/
rm -r docjs
