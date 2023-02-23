/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const path = require('path');
const { version } = require('./package.json');

module.exports = {
  version,
  template: {
    favicon: 'img/favicon.png',
  },
  components: [],
  require: [
    path.join(__dirname, 'src/styleguidist/styleguidist.css'),

    // I have no idea why I need to re-add these file, they are already in src/index.js
    // When you use the "components" property (ex: components: ['src/components/Autocomplete/Autocomplete.js']),
    // the web-component works as expected.
    // but if you use the "sections" property, the web-component doesn't work.
    'react-app-polyfill/stable',
    'abortcontroller-polyfill/dist/abortcontroller-polyfill-only',
    '@webcomponents/webcomponents-platform',
    '@webcomponents/custom-elements',
    '@webcomponents/webcomponentsjs/custom-elements-es5-adapter',
    'proxy-polyfill',
  ],
  ribbon: {
    url: 'https://github.com/geops/trafimage-maps',
    text: 'Fork me on GitHub',
  },
  moduleAliases: {
    'trafimage-maps/es': path.resolve(__dirname, 'src'),
    'trafimage-maps': path.resolve(__dirname, 'src'),
  },
  pagePerSection: true,
  sections: [
    {
      name: 'trafimage-maps',
      content: 'src/examples/WebComponent/README.md',
      sectionDepth: 2,
      exampleMode: 'hide',
    },
    {
      name: 'Examples',
      href: '#/Examples/Vanilla%20JS/Construction',
      sectionDepth: 2,
      sections: [
        {
          name: 'Vanilla JS',
          href: '#/Examples/Vanilla%20JS/Construction',
          sections: [
            {
              name: 'Construction',
              content: 'src/examples/Construction/README.md',
              exampleMode: 'expand',
            },
            {
              name: 'Direct connections by night',
              content: 'src/examples/DirektVerbindung/README.md',
              exampleMode: 'expand',
            },
            {
              name: 'Infrastruktur Betriebsregionen',
              content: 'src/examples/Betriebsregionen/README.md',
              exampleMode: 'expand',
            },
            {
              name: 'Geltungsbereiche',
              content: 'src/examples/Geltungsbereiche/README.md',
              exampleMode: 'expand',
            },
          ],
        },
        {
          name: 'React',
          href: '#/Examples/React/Custom%20Topic',
          sections: [
            {
              name: 'Custom Topic',
              content: 'src/examples/CustomTopic/README.md',
              exampleMode: 'expand',
            },
            {
              name: 'Override Topic',
              content: 'src/examples/OverrideTopic/README.md',
              exampleMode: 'expand',
            },
            {
              name: 'Punctuality Map',
              content: 'src/examples/Punctuality/README.md',
              exampleMode: 'expand',
            },
            {
              name: 'Casa Map',
              content: 'src/examples/Casa/README.md',
              exampleMode: 'expand',
            },
            {
              name: 'Schulzug',
              content: 'src/examples/Schulzug/README.md',
              exampleMode: 'expand',
            },
          ],
        },
        {
          name: 'Angular',
          content: 'src/examples/Angular/README.md',
          exampleMode: 'expand',
        },
        {
          name: 'Iframe',
          href: '#/Examples/Iframe/Basic',
          exampleMode: 'expand',
          sections: [
            {
              name: 'Basic',
              content: 'src/examples/iframe/README.md',
              exampleMode: 'hide',
            },
            {
              name: 'Geltungsbereiche',
              content: 'src/examples/iframe/Geltungsbereiche/README.md',
              exampleMode: 'hide',
            },
          ],
        },
      ],
    },
  ],
  theme: {
    color: {
      links: '#6987a1',
      linkHover: '#76B833',
    },
    fontSize: {
      base: 16,
      text: 17,
      small: 14,
      h1: 48,
      h2: 36,
      h3: 24,
      h4: 18,
      h5: 16,
      h6: 16,
    },
  },
  styles: {
    StyleGuide: {
      '@global body': {
        overflowY: 'hidden',
        overflowX: 'hidden',
      },
    },
  },
  showSidebar: true,
  styleguideComponents: {
    ComponentsList: path.join(__dirname, 'src/styleguidist/ComponentsList'),
    StyleGuideRenderer: path.join(__dirname, 'src/styleguidist/StyleGuide'),
  },
};
