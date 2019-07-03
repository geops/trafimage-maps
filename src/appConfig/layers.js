import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

proj4.defs(
  'EPSG:21781',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
    '+x_0=600000 +y_0=200000 +ellps=bessel ' +
    '+towgs84=660.077,13.551,369.344,2.484,1.783,2.939,5.66 +units=m +no_defs',
);

proj4.defs(
  'EPSG:2056',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
    '+x_0=2600000 +y_0=1200000 +ellps=bessel ' +
    '+towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
);

register(proj4);

const projectionExtent = [
  -20037509.3428,
  -20037508.3428,
  20037508.3428,
  20037508.3428,
];

const resolutions = [
  156543.033928,
  78271.516964,
  39135.758482,
  19567.879241,
  9783.9396205,
  4891.96981025,
  2445.98490513,
  1222.99245256,
  611.496226281,
  305.748113141,
  152.87405657,
  76.4370282852,
  38.2185141426,
  19.1092570713,
  9.55462853565,
  4.77731426782,
  2.38865713391,
  1.19432856696,
  0.597164283478,
  0.298582141739,
];

export default [
  {
    name: 'Basemap',
    topics: ['ch.sbb.netzkarte'],
    copyright: 'OpenStreetMap contributors, © SBB/CFF/FFS',
    visible: true,
    isBaseLayer: true,
    data: {
      type: 'wmts',
      url:
        'http://vtiles.trafimage.geops.ch/styles/' +
        'trafimage_perimeter/{TileMatrix}/{TileCol}/{TileRow}.png',
      matrixSet: 'webmercator',
      requestEncoding: 'REST',
      projectionExtent,
      resolutions,
    },
  },
  {
    name: 'Swisstopo Swissimage',
    topics: ['ch.sbb.netzkarte'],
    copyright: 'swisstopo (5704003351)',
    visible: false,
    isBaseLayer: true,
    data: {
      type: 'wmts',
      url:
        'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage-product/' +
        'default/current/3857/{TileMatrix}/{TileCol}/{TileRow}.jpeg',
      matrixSet: 'webmercator',
      requestEncoding: 'REST',
      projectionExtent,
      resolutions,
    },
  },
];
