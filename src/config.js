// Variable to configure if PWA Service Worker is registered in index.js.
const pwaActive = false;
let tilesUrl = '//tiles.dev.trafimage.geops.ch';

switch (process.env.REACT_APP_ENV) {
  case 'local': {
    tilesUrl = '//tiles.dev.trafimage.geops.ch';
    break;
  }
  case 'prod': {
    tilesUrl = '//tiles.trafimage.ch';
    break;
  }
  case 'stag': {
    tilesUrl = '//tiles.stag.trafimage.geops.ch';
    break;
  }
  case 'dev':
  default: {
    tilesUrl = '//tiles.dev.trafimage.geops.ch';
    break;
  }
}

export default {
  pwaActive,
  tilesUrl,
};
