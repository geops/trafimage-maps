const { version } = require('./package.json');

module.exports = {
  title: `geOps react-spatial Starter ${version}`,
  require: ['react-app-polyfill/ie11', 'react-app-polyfill/stable'],
  sections: [
    {
      name: '',
      content: 'README.md',
    },
    // {
    //  name: 'UI components',
    //  description: 'A collection of react components.',
    //  components: 'src/components/**/*.js',
    //  exampleMode: 'expand',
    //  usageMode: 'expand',
    // },
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
      ],
    },
  },
};
