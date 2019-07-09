const path = require('path');
const { version } = require('./package.json');

module.exports = {
  title: `Trafimage Webkartenportal ${version}`,
  require: [
    path.join(__dirname, 'src/themes/examples.scss'),
    'react-app-polyfill/ie11',
    'react-app-polyfill/stable',
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
      content: './src/layers/README.md',
    },
  ],
  webpackConfig: {
    module: {
      rules: [
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
