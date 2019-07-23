const { version } = require('./package.json');

module.exports = {
  title: `Trafimage Webkartenportal ${version}`,
  require: [
    'react-app-polyfill/ie11',
    'react-app-polyfill/stable',
    'abortcontroller-polyfill/dist/abortcontroller-polyfill-only',
  ],
  ribbon: {
    url: 'https://github.com/geops/trafimage-maps',
    text: 'Fork me on GitHub',
  },
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
      name: 'Layers',
      sections: [
        {
          name: 'RouteLayer',
          content: 'src/layers/RouteLayer/README.md',
        },
        {
          name: 'ZoneLayer',
          content: 'src/layers/ZoneLayer/README.md',
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
};
