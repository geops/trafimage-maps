// Variable to configure if PWA Service Worker is registered in index.js.
const pwaActive = false;
let tilesUrl = '//tiles.dev.trafimage.geops.ch';
const geoadminWmtsUrl = '//maps{1-3}.trafimage.ch';
const geoserverUrl = '//maps.trafimage.ch/geoserver/trafimage/ows';

// Swiss extent in 3857.
const swissExtent = [656409.5, 5740863.4, 1200512.3, 6077033.16];

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
  geoadminWmtsUrl,
  geoserverUrl,
  swissExtent,
};
