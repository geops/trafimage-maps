const documentation = require('documentation');
const fs = require('fs');

documentation
  .build(['./src/layers/**'], { shallow: false })
  .then(documentation.formats.md)
  .then(output => {
    // output is a string of Markdown data
    fs.writeFileSync('./src/layers/README.md', output);
  });
