const path = require('path');
const { version } = require('./package.json');

module.exports = {
  version,
  template: {
    favicon: 'img/favicon.png',
  },
  assetsDir: 'src/',
  styleguideDir: 'styleguide-build',
  require: [
    path.join(__dirname, 'src/styleguidist/styleguidist.css'),
    'react-app-polyfill/ie11',
    'react-app-polyfill/stable',
    'abortcontroller-polyfill/dist/abortcontroller-polyfill-only',
    path.join(__dirname, 'src/i18n.js'),
  ],
  ribbon: {
    url: 'https://github.com/geops/trafimage-maps',
    text: 'Fork me on GitHub',
  },
  moduleAliases: {
    'trafimage-maps': path.resolve(__dirname, 'src'),
  },
  sections: [
    {
      name: '',
      context: 'README.md',
    },
    {
      name: 'Applications',
      sections: [
        {
          name: 'Casa',
          content: 'src/apps/Casa/README.md',
        },
        {
          name: 'Trafimage WKP',
          content: 'src/apps/TrafimageWKP/README.md',
        },
      ],
    },
    {
      name: 'Popups',
      sections: [
        {
          name: 'BahnhofplanPopup',
          content: 'src/popups/BahnhofplanPopup/README.md',
        },
      ],
    },
  ],
  webpackConfig: {
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
        // Transpile node dependencies, node deps are often not transpiled for IE11
        {
          test: [
            /\/node_modules\/(regexpu-core|unicode-.*|chalk|acorn-.*|query-string|strict-uri-encode)/,
            /\/node_modules\/(split-on-first|react-dev-utils|ansi-styles|jsts|estree-walker|strip-ansi)/,
          ],
          loader: 'babel-loader',
        },
        // Transpile js
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        // Load css and scss files.
        {
          test: /\.s?css$/,
          use: ['style-loader', 'css-loader', 'sass-loader?modules'],
        },
        {
          test: /^((?!url).)*\.svg$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'react-svg-loader',
              options: {
                jsx: true, // true outputs JSX tags
              },
            },
          ],
        },
        {
          test: /\.url\.svg$/,
          loader: 'url-loader',
        },
        {
          test: /\.png$/,
          use: [
            {
              loader: 'url-loader',
            },
          ],
        },
      ],
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
