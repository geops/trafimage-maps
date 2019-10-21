import proj4 from 'proj4';
import TileLayer from 'ol/layer/Tile';
import WMTSSource from 'ol/source/WMTS';
import TileWMSSource from 'ol/source/TileWMS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import TileGrid from 'ol/tilegrid/TileGrid';
import { register } from 'ol/proj/proj4';
import Layer from 'react-spatial/layers/Layer';
import TrajservLayer from 'react-transit/layers/TrajservLayer';
import MapboxLayer from 'react-spatial/layers/MapboxLayer';
import WMSLayer from 'react-spatial/layers/WMSLayer';
import PassagierfrequenzenLayer from '../../../layers/PassagierfrequenzenLayer';
import BahnhofplanLayer from '../../../layers/BahnhofplanLayer';
import NetzkartePointLayer from '../../../layers/NetzkartePointLayer';
import CONF from '../../appConfig';

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

export const netzkarteLayer = new MapboxLayer({
  name: 'ch.sbb.netzkarte',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  url:
    `${CONF.vectorTilesUrl}/styles/trafimage_perimeter_v2/style.json` +
    `?key=${CONF.vectorTilesKey}`,
});

export const netzkarteLayerLight = new MapboxLayer({
  name: 'ch.sbb.netzkarte.light',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: false,
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  url:
    `${CONF.vectorTilesUrl}/styles/evoq_sandbox2/style.json` +
    `?key=${CONF.vectorTilesKey}`,
});
export const netzkarteLayerNight = new MapboxLayer({
  name: 'ch.sbb.netzkarte.night',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: false,
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  url:
    `${CONF.vectorTilesUrl}/styles/evoq_sandbox1/style.json` +
    `?key=${CONF.vectorTilesKey}`,
});

export const swisstopoSwissImage = new Layer({
  name: 'Swissimage',
  key: 'ch.sbb.netzkarte.luftbild',
  copyright: 'swisstopo (5704003351)',
  visible: false,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `${CONF.geoadminWmtsUrl}/geo-admin-wmts/1.0.0/` +
        `ch.swisstopo.swissimage/default/current/3857/` +
        '{TileMatrix}/{TileCol}/{TileRow}.jpeg',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      transition: 0,
      crossOrigin: 'anonymous',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
  }),
});

export const netzkarteAerial = new Layer({
  name: 'Netzkarte Luftbild',
  key: 'ch.sbb.netzkarte.overlay',
  visible: false,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `${CONF.tileserverUrlMapproxy}/wmts/netzkarte_aerial_webmercator` +
        '/webmercator/{TileMatrix}/{TileCol}/{TileRow}.png',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      transition: 0,
      crossOrigin: 'anonymous',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
  }),
});

export const aerial = new Layer({
  name: 'ch.sbb.netzkarte.luftbild.group',
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  visible: false,
});

aerial.setChildren([swisstopoSwissImage, netzkarteAerial]);

export const swisstopoLandeskarte = new Layer({
  name: 'ch.sbb.netzkarte.landeskarte',
  copyright: 'swisstopo (5704003351)',
  visible: false,
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `${CONF.geoadminWmtsUrl}/geo-admin-wmts/1.0.0/` +
        'ch.swisstopo.pixelkarte-farbe/default/current/3857/' +
        '{TileMatrix}/{TileCol}/{TileRow}.jpeg',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      transition: 0,
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
  }),
});

export const swisstopoLandeskarteGrau = new Layer({
  name: 'ch.sbb.netzkarte.landeskarte.grau',
  copyright: 'swisstopo (5704003351)',
  visible: false,
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `${CONF.geoadminWmtsUrl}/geo-admin-wmts/1.0.0/` +
        'ch.swisstopo.pixelkarte-grau/default/current/3857/' +
        '{TileMatrix}/{TileCol}/{TileRow}.jpeg',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      transition: 0,
      crossOrigin: 'anonymous',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
  }),
});

export const passagierfrequenzen = new PassagierfrequenzenLayer({
  visible: false,
});

export const bahnhofplaene = new Layer({
  name: 'ch.sbb.bahnhofplaene',
  visible: false,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.bahnhofplaene-desc',
  },
});

bahnhofplaene.setChildren([
  new BahnhofplanLayer({
    name: 'ch.sbb.bahnhofplaene.printprodukte',
    visible: false,
    showPrintFeatures: true,
    properties: {
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.printprodukte-desc',
    },
  }),
  new BahnhofplanLayer({
    name: 'ch.sbb.bahnhofplaene.interaktiv',
    visible: false,
    properties: {
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.interaktiv-desc',
    },
  }),
]);

export const tracker = new TrajservLayer({
  name: 'Zugtracker',
  key: 'ch.sbb.tracker',
  visible: false,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.tracker-desc',
  },
});

export const punctuality = new Layer({
  name: 'ch.sbb.puenktlichkeit',
  visible: false,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.puenktlichkeit-desc',
    legendUrl:
      '/img/layers/puenktlichkeit/puenktlichkeit_legend_{language}.png',
  },
});

const apiPublicKey = '5cc87b12d7c5370001c1d6551c1d597442444f8f8adc27fefe2f6b93';
punctuality.setChildren([
  new TrajservLayer({
    name: 'ch.sbb.puenktlichkeit-nv',
    apiKey: apiPublicKey,
    visible: false,
    useDelayStyle: true,
    radioGroup: 'ch.sbb.punctuality',
    regexPublishedLineName: '^(S|R$|RE|PE|D|IRE|RB|TER)',
  }),
  new TrajservLayer({
    name: 'ch.sbb.puenktlichkeit-fv',
    apiKey: apiPublicKey,
    visible: false,
    useDelayStyle: true,
    radioGroup: 'ch.sbb.punctuality',
    regexPublishedLineName: '(IR|IC|EC|RJX|TGV)',
  }),
  new TrajservLayer({
    name: 'ch.sbb.puenktlichkeit-all',
    apiKey: apiPublicKey,
    visible: false,
    useDelayStyle: true,
    radioGroup: 'ch.sbb.punctuality',
  }),
]);

export const netzkartePointLayer = new Layer({
  name: 'Stationen',
  key: 'ch.sbb.netzkarte.stationen',
  properties: {
    hideInLegend: true,
  },
});

netzkartePointLayer.setChildren([
  new NetzkartePointLayer({ useBboxStrategy: true }),
  new NetzkartePointLayer({ showAirports: true }),
]);

export const buslines = new Layer({
  name: 'ch.sbb.netzkarte.buslinien',
  visible: false,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `${CONF.tileserverUrlMapproxy}/wmts/netzkarte_buslines_webmercator` +
        '/webmercator/{TileMatrix}/{TileCol}/{TileRow}.png',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      crossOrigin: 'anonymous',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
    maxResolution: 20,
  }),
  properties: {
    hasInfos: true,
    description: 'ch.sbb.netzkarte.buslinien-desc',
  },
});

export const gemeindegrenzen = new WMSLayer({
  name: 'ch.sbb.ch_gemeinden',
  visible: false,
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
  properties: {
    hasInfos: true,
    description: 'ch.sbb.ch_gemeinden-desc',
  },
});

export const parks = new WMSLayer({
  name: 'ch.sbb.parks',
  visible: false,
  olLayer: new TileLayer({
    source: new TileWMSSource({
      url: `${CONF.geoserverUrl}/service/wms`,
      crossOrigin: 'anonymous',
      params: {
        layers: 'trafimage:perimeter_parks',
      },
      tileGrid: new TileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
    opacity: 0.9,
  }),
  properties: {
    hasInfos: true,
    description: 'ch.sbb.parks-desc',
  },
});

export default [
  netzkarteLayer,
  netzkarteLayerLight,
  netzkarteLayerNight,
  swisstopoLandeskarteGrau,
  swisstopoLandeskarte,
  aerial,
];
