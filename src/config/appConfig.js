let tileserverUrlMapproxy = '//wkp.dev.trafimage.geops.ch/raster';

const env = process && process.env && process.env.REACT_APP_ENV;

switch (env) {
  case 'wkp_stag': {
    tileserverUrlMapproxy = '//wkp.stag.trafimage.geops.ch/raster';
    break;
  }
  case 'wkp_prod': {
    tileserverUrlMapproxy = '//maps{1-3}.trafimage.ch/raster';
    break;
  }
  default: {
    break;
  }
}

export default {
  tileserverUrlMapproxy,
};
