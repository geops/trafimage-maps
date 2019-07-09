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
      name: 'UI components',
      sections: [
        {
          name: 'Spatial',
          description: 'Spatial components',
          components: ['src/components/Map/[A-Z]*.js'],
          exampleMode: 'expand',
          usageMode: 'collapse',
        },
        {
          name: 'Basic',
          description: 'Basic components',
          components: [
            'src/components/Footer/[A-Z]*.js',
            'src/components/Header/[A-Z]*.js',
            'src/components/Menu/[A-Z]*.js',
            'src/components/Permalink/[A-Z]*.js',
          ],
          exampleMode: 'expand',
          usageMode: 'collapse',
        },
      ],
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
