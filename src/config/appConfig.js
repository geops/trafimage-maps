// Variable to configure if PWA Service Worker is registered in index.js.
const pwaActive = false;
const geoadminWmtsUrl = '//maps.trafimage.ch';
const geoserverUrl = '//maps.trafimage.ch/geoserver/trafimage/ows';
const geoserverCachedUrl = '//maps.trafimage.ch/service/gjc/ows';
let tileserverUrlMapproxy = '//wkp.dev.trafimage.geops.ch/raster';
let vectorTilesKey = '5cc87b12d7c5370001c1d6557f01e26728174c1fa19d33afe303b910';
let vectorTilesUrl = '//maps.geops.io';
let departureUrl = '//wkp.dev.trafimage.geops.ch/search';

// Swiss extent in 3857.
const swissExtent = [656409.5, 5740863.4, 1200512.3, 6077033.16];

switch (process.env.REACT_APP_ENV) {
  case 'wkp_stag': {
    tileserverUrlMapproxy = '//wkp.stag.trafimage.geops.ch/raster';
    departureUrl = '//wkp.stag.trafimage.geops.ch/search';
    break;
  }
  case 'wkp_prod': {
    tileserverUrlMapproxy = '//maps{1-3}.trafimage.ch/raster';
    departureUrl = '//maps.trafimage.ch/search';
    break;
  }
  case 'stele': {
    vectorTilesKey = null;
    vectorTilesUrl = '/tileserver';
    departureUrl = process.env.REACT_APP_CONTAINER_URL;
    break;
  }
  default: {
    break;
  }
}

export default {
  pwaActive,
  geoadminWmtsUrl,
  geoserverUrl,
  geoserverCachedUrl,
  swissExtent,
  tileserverUrlMapproxy,
  vectorTilesUrl,
  vectorTilesKey,
  departureUrl,
};
