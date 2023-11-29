/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
// eslint-disable-next-line no-unused-vars
const path = require('path');
const { version } = require('./package.json');
const webpackConfigFunc = require('./node_modules/react-scripts/config/webpack.config.js');
const override = require('./packages/wc/config-overrides');

const webpackConfig = override(webpackConfigFunc('production'), 'production');

module.exports = {
  version,
  template: {
    favicon: 'img/favicon.png',
  },
  components: [],
  ribbon: {
    url: 'https://github.com/geops/trafimage-maps',
    text: 'Fork me on GitHub',
  },
  moduleAliases: {
    'trafimage-maps/es': path.join(__dirname, 'src'),
    'trafimage-maps': path.join(__dirname, 'src'),
  },
  showSidebar: true,
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
      href: '#/Examples/HTML%20%26%20Vanilla%20JS/Construction',
      sectionDepth: 2,
      sections: [
        {
          name: 'HTML & Vanilla JS',
          href: '#/Examples/HTML%20%26%20Vanilla%20JS/Construction',
          sections: [
            {
              name: 'Construction',
              content: 'src/examples/Construction/README.md',
              exampleMode: 'hide',
            },
            {
              name: 'Direct Connections',
              content: 'src/examples/DirektVerbindung/README.md',
              exampleMode: 'hide',
            },
            {
              name: 'Operating Regions',
              content: 'src/examples/Betriebsregionen/README.md',
              exampleMode: 'hide',
            },
            {
              name: 'Area of Validity',
              content: 'src/examples/Geltungsbereiche/README.md',
              exampleMode: 'hide',
            },
            {
              name: 'External Component Update',
              content: 'src/examples/ExternalUpdate/README.md',
              exampleMode: 'hide',
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
              exampleMode: 'hide',
            },
            {
              name: 'Override Topic',
              content: 'src/examples/OverrideTopic/README.md',
              exampleMode: 'hide',
            },
            {
              name: 'Punctuality Map',
              content: 'src/examples/Punctuality/README.md',
              exampleMode: 'hide',
            },
            {
              name: 'Casa Map',
              content: 'src/examples/Casa/README.md',
              exampleMode: 'hide',
            },
            {
              name: 'Schulzug',
              content: 'src/examples/Schulzug/README.md',
              exampleMode: 'hide',
            },
          ],
        },
        {
          name: 'Angular',
          content: 'src/examples/Angular/README.md',
        },
        {
          name: 'Iframe',
          href: '#/Examples/Iframe/Basic',
          sections: [
            {
              name: 'Basic',
              content: 'src/examples/iframe/README.md',
              exampleMode: 'hide',
            },
            {
              name: 'Area of Validity',
              content: 'src/examples/iframe/Geltungsbereiche/README.md',
              exampleMode: 'hide',
            },
            {
              name: 'Railplus',
              content: 'src/examples/iframe/Railplus/README.md',
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
  styleguideComponents: {
    ComponentsList: path.join(__dirname, 'src/styleguidist/ComponentsList'),
    StyleGuideRenderer: path.join(__dirname, 'src/styleguidist/StyleGuide'),
  },
  webpackConfig: {
    optimization: webpackConfig.optimization,
    plugins: webpackConfig.plugins,
    module: webpackConfig.module,
  },
};
