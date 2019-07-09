const documentation = require('documentation');
const fs = require('fs');

['RouteLayer', 'VerbundLayer'].forEach(l => {
  documentation
    .build([`./src/layers/${l}/**`], { shallow: false })
    .then(doc => {
      // Unset name to avoid duplicatin with styleguidist name.
      // eslint-disable-next-line no-param-reassign
      doc[0].name = undefined;
      return documentation.formats.md(doc);
    })
    .then(output => {
      // output is a string of Markdown data
      fs.writeFileSync(`./src/layers/${l}/README.md`, output);
    });
});
