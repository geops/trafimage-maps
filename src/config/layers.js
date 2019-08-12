import proj4 from 'proj4';
import TileLayer from 'ol/layer/Tile';
import WMTSSource from 'ol/source/WMTS';
import TileWMSSource from 'ol/source/TileWMS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import TileGrid from 'ol/tilegrid/TileGrid';
import { register } from 'ol/proj/proj4';
import Layer from 'react-spatial/Layer';
import WMSLayer from 'react-spatial/layers/WMSLayer';
import TrafimageRasterLayer from '../layers/TrafimageRasterLayer';
import BahnhofplanLayer from '../layers/BahnhofplanLayer';
import NetzkartePointLayer from '../layers/NetzkartePointLayer';
import CONF from './appConfig';

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

export const netzkarteLayer = new TrafimageRasterLayer({
  name: 'Netzkarte',
  key: 'ch.sbb.netzkarte',
  copyright: 'OpenStreetMap contributors, © SBB/CFF/FFS',
  visible: true,
  isBaseLayer: true,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `https://maps.geops.io/styles/trafimage_perimeter_v2/` +
        `{TileMatrix}/{TileCol}/{TileRow}.png`,
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
    zIndex: -10,
  }),
});

export const swisstopoSwissImage = new Layer({
  name: 'Netzkarte Luftbild',
  key: 'ch.sbb.netzkarte.luftbild',
  copyright: 'swisstopo (5704003351)',
  visible: false,
  isBaseLayer: true,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `${CONF.geoadminWmtsUrl}/geo-admin-wmts/1.0.0/ch.swisstopo.swissimage/` +
        'default/current/3857/{TileMatrix}/{TileCol}/{TileRow}.jpeg',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
    zIndex: -10,
  }),
});

export const netzkarteAerial = new Layer({
  name: 'Netzkarte Luftbild',
  key: 'ch.sbb.netzkarte.overlay',
  visible: false,
  isBaseLayer: true,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `${CONF.tileserverUrlMapproxy}/wmts/netzkarte_aerial_webmercator` +
        '/webmercator/{TileMatrix}/{TileCol}/{TileRow}.png',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
    zIndex: -10,
  }),
});

export const aerial = new Layer({
  name: 'ch.sbb.netzkarte.luftbild.group',
  isBaseLayer: true,
});

aerial.setChildren([swisstopoSwissImage, netzkarteAerial]);

export const swisstopoLandeskarte = new Layer({
  name: 'Landeskarte',
  key: 'ch.sbb.netzkarte.landeskarte',
  copyright: 'swisstopo (5704003351)',
  visible: false,
  isBaseLayer: true,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `${CONF.geoadminWmtsUrl}/geo-admin-wmts/1.0.0/ch.swisstopo.pixelkarte-farbe/` +
        'default/current/3857/{TileMatrix}/{TileCol}/{TileRow}.jpeg',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
    zIndex: -10,
  }),
});

export const swisstopoLandeskarteGrau = new Layer({
  name: 'Landeskarte (grau)',
  key: 'ch.sbb.netzkarte.landeskarte.grau',
  copyright: 'swisstopo (5704003351)',
  visible: false,
  isBaseLayer: true,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `${CONF.geoadminWmtsUrl}/geo-admin-wmts/1.0.0/ch.swisstopo.pixelkarte-grau/` +
        'default/current/3857/{TileMatrix}/{TileCol}/{TileRow}.jpeg',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
    zIndex: -10,
  }),
});

export const bahnhofplaene = new Layer({
  name: 'Bahnhofpläne',
  key: 'ch.sbb.bahnhofplaene',
});

bahnhofplaene.setChildren([
  new BahnhofplanLayer({ visible: false }),
  new BahnhofplanLayer({ showPrintFeatures: true }),
]);

export const netzkartePointLayer = new Layer({
  name: 'Stationen',
  key: 'ch.sbb.stationen.parent',
});

netzkartePointLayer.setChildren([
  new NetzkartePointLayer({ useBboxStrategy: true }),
  new NetzkartePointLayer({ showAirports: true }),
]);

export const buslines = new Layer({
  name: 'ch.sbb.netzkarte.buslinien',
  key: 'ch.sbb.netzkarte.buslinien',
  visible: true,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `${CONF.tileserverUrlMapproxy}/wmts/netzkarte_buslines_webmercator` +
        '/webmercator/{TileMatrix}/{TileCol}/{TileRow}.png',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
    maxResolution: 20,
    zIndex: -9,
  }),
});

export const gemeindegrenzen = new WMSLayer({
  name: 'ch.sbb.ch_gemeinden',
  key: 'ch.sbb.ch_gemeinden',
  visible: true,
  olLayer: new TileLayer({
    source: new TileWMSSource({
      url: `${CONF.geoserverUrl}/service/wms`,
      crossOrigin: 'anonymous',
      params: {
        layers: 'trafimage:gemeindegrenzen',
        STYLES: 'gemeindegrenzen_netzkarte',
      },
      tileGrid: new TileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
  }),
});

export default [
  aerial,
  swisstopoLandeskarte,
  swisstopoLandeskarteGrau,
  netzkarteLayer,
];
