// Comes from https://github.com/facebook/create-react-app/issues/5306#issuecomment-434164820
const rewire = require('rewire');

const defaults = rewire('react-scripts/scripts/build.js');
// eslint-disable-next-line no-underscore-dangle
const config = defaults.__get__('config');

config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
};
config.optimization.runtimeChunk = false;
