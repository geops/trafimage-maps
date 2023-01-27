/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
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
      name: 'Web component',
      sections: [
        {
          name: 'trafimage-maps',
          content: 'src/examples/README.md',
          components: 'src/WebComponent.js',
          exampleMode: 'hide',
        },
      ],
    },
    {
      name: 'React examples',
      href: '/#/React examples/Custom%20Topic',
      external: true,
      sectionDepth: 2,
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
          name: 'Schulzug',
          content: 'src/examples/Schulzug/README.md',
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
      name: 'Iframe',
      content: 'src/examples/iframe/README.md',
      external: true,
      sectionDepth: 2,
      exampleMode: 'hide',
      sections: [
        {
          name: 'Geltungsbereiche',
          content: 'src/examples/iframe/Geltungsbereiche/README.md',
          exampleMode: 'hide',
        },
      ],
    },
  ],
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
