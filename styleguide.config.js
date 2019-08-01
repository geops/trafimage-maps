const path = require('path');
const { version } = require('./package.json');

module.exports = {
  title: `Trafimage Webkartenportal ${version}`,
  template: {
    favicon: 'img/favicon.png',
  },
  assetsDir: 'src/',
  styleguideDir: 'doc',
  require: [
    path.join(__dirname, 'src/styleguidist/styleguidist.css'),
    'react-app-polyfill/ie11',
    'react-app-polyfill/stable',
    'abortcontroller-polyfill/dist/abortcontroller-polyfill-only',
  ],
  sections: [
    {
      name: '',
      context: 'README.md',
    },
    {
      name: 'Components',
      components: ['src/components/TrafimageMaps/[A-Z]*.js'],
      exampleMode: 'expand',
      usageMode: 'collapse',
    },
    {
      name: 'Applications',
      sections: [
        {
          name: 'Casa',
          content: 'src/apps/Casa/README.md',
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
            /\/node_modules\/(regexpu-core|unicode-.*|acorn-.*|query-string|strict-uri-encode)/,
            /\/node_modules\/(split-on-first|react-dev-utils|ansi-styles|jsts|estree-walker)/,
          ],
          loader: 'babel-loader',
        },
        // Babel loader, will use your project’s .babelrc
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
