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
  assetsDir: 'src/',
  components: [],
  styleguideDir: 'styleguide-build',
  require: [
    path.join(__dirname, 'src/styleguidist/styleguidist.css'),
    path.join(__dirname, 'build/bundle.js'),
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
      name: 'Applications',
      content: 'src/apps/README.md',
      sections: [
        {
          name: 'WebComponent',
          sections: [
            {
              name: '<trafimage-maps>',
              content: 'src/apps/WebComponent/README.md',
            },
          ],
        },
        {
          name: 'Examples',
          sections: [
            {
              name: 'Punctuality Map',
              content: 'src/apps/TrafimageWKP/README.md',
            },
            {
              name: 'Casa Map',
              content: 'src/apps/Casa/README.md',
            },
          ],
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
              loader: require.resolve('babel-loader'),
              options: {
                // @remove-on-eject-begin
                babelrc: false,
                presets: [require.resolve('babel-preset-react-app')],
                // @remove-on-eject-end
                cacheDirectory: true,
              },
            },
            require.resolve('@svgr/webpack'),
            {
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
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
    plugins: [
      new webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env) }),
    ],
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
