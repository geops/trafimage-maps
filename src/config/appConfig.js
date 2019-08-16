// Variable to configure if PWA Service Worker is registered in index.js.
const pwaActive = false;
let tilesUrl = '//tiles.dev.trafimage.geops.ch';
const geoadminWmtsUrl = '//maps{1-3}.trafimage.ch';
const geoserverUrl = '//maps.trafimage.ch/geoserver/trafimage/ows';
let tileserverUrlMapproxy = '//wkp.dev.trafimage.geops.ch/raster';
let vectorTilesUrl = 'https://maps.geops.io';
const vectorTilesKey =
  '5cc87b12d7c5370001c1d6557f01e26728174c1fa19d33afe303b910';

// Swiss extent in 3857.
const swissExtent = [656409.5, 5740863.4, 1200512.3, 6077033.16];

switch (process.env.REACT_APP_ENV) {
  case 'local': {
    tilesUrl = '//tiles.dev.trafimage.geops.ch';
    tileserverUrlMapproxy = '//wkp.dev.trafimage.geops.ch/raster';
    break;
  }
  case 'prod': {
    tilesUrl = '//tiles.trafimage.ch';
    tileserverUrlMapproxy = '//maps{1-3}.trafimage.ch/raster';
    break;
  }
  case 'stag': {
    tilesUrl = '//tiles.stag.trafimage.geops.ch';
    tileserverUrlMapproxy = '//wkp.stag.trafimage.geops.ch/raster';
    break;
  }
  case 'dev':
  default: {
    tilesUrl = '//tiles.dev.trafimage.geops.ch';
    tileserverUrlMapproxy = '//wkp.dev.trafimage.geops.ch/raster';
    vectorTilesUrl = 'https://maps.style-dev.geops.io';
    break;
  }
}

export default {
  pwaActive,
  tilesUrl,
  geoadminWmtsUrl,
  geoserverUrl,
  swissExtent,
  tileserverUrlMapproxy,
  vectorTilesUrl,
  vectorTilesKey,
};
