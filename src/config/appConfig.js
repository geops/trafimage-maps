// Variable to configure if PWA Service Worker is registered in index.js.
const pwaActive = false;
let tilesUrl = '//tiles.dev.trafimage.geops.ch';
const geoadminWmtsUrl = '//maps{1-3}.trafimage.ch';
const geoserverUrl = '//maps.trafimage.ch/geoserver/trafimage/ows';
let tileserverUrlMapproxy = '//wkp.dev.trafimage.geops.ch/raster';

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
    break;
  }
}

export default {
  pwaActive,
  tilesUrl,
  geoadminWmtsUrl,
  geoserverUrl,
  tileserverUrlMapproxy,
};
