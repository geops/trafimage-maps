// Variable to configure if PWA Service Worker is registered in index.js.
const pwaActive = false;
const geoadminWmtsUrl = '//maps.trafimage.ch';
const geoserverUrl = '//maps.trafimage.ch/geoserver/trafimage/ows';
const geoserverCachedUrl = '//maps.trafimage.ch/service/gjc/ows';
let tileserverUrlMapproxy = '//wkp.dev.trafimage.geops.ch/raster';
let vectorTilesKey = '5cc87b12d7c5370001c1d6557f01e26728174c1fa19d33afe303b910';
let vectorTilesUrl = '//maps.geops.io';
let cartaroUrl = '//cartaro2.dev.trafimage.ch/api/v1/';

// Swiss extent in 3857.
const swissExtent = [656409.5, 5740863.4, 1200512.3, 6077033.16];
const env = process && process.env && process.env.REACT_APP_ENV;

switch (env) {
  case 'wkp_stag': {
    tileserverUrlMapproxy = '//wkp.stag.trafimage.geops.ch/raster';
    cartaroUrl = '//cartaro2.stag.trafimage.ch/api/v1/';
    break;
  }
  case 'wkp_prod': {
    tileserverUrlMapproxy = '//maps{1-3}.trafimage.ch/raster';
    cartaroUrl = '//cartaro2.prod.trafimage.ch/api/v1/';
    break;
  }
  case 'stele': {
    vectorTilesKey = null;
    vectorTilesUrl = '/tileserver';
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
  cartaroUrl,
};
