const { version } = require('./package.json');

module.exports = {
  title: `Trafimage Webkartenportal ${version}`,
  require: ['react-app-polyfill/ie11', 'react-app-polyfill/stable'],
  sections: [
    {
      name: '',
      context: 'README.md',
    },
    {
      name: 'Applications',
      components: [
        'src/components/TrafimageMaps/[A-Z]*.js',
      ],
    },
    {
      name: 'Layers',
      components: [
        'src/layers/VerbundLayer/[A-Z]*.js',
        'src/layers/RouteLayer/[A-Z]*.js',
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
