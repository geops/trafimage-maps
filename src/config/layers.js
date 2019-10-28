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
import MapboxStyleLayer from '../layers/MapboxStyleLayer';
import HandicapLayer from '../layers/HandicapLayer';
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

export const netzkarteLayer = new MapboxLayer({
  name: 'ch.sbb.netzkarte',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  isQueryable: false,
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  // url: `/styles/trafimage_perimetererweiterung_v2.json?key=${CONF.vectorTilesKey}`,
  url:
    `${CONF.vectorTilesUrl}/styles/trafimage_perimeter_v2/style.json` +
    `?key=${CONF.vectorTilesKey}`,
});

/**
 * This layer create a MapboxLayer used by all the MapboxStyleLayer.
 * Its style file contains only source where to find datas.
 * The style of features are  defined by each MapboxStyleLayer ('netzkarte_point, buslinien,...)
 */
export const sourcesLayer = new MapboxLayer({
  name: 'ch.sbb.netzkarte.sources',
  zIndex: 1,
  preserveDrawingBuffer: true,
  url:
    `${CONF.vectorTilesUrl}/styles/trafimage_sources_only/style.json` +
    `?key=${CONF.vectorTilesKey}`,
  properties: {
    hideInLegend: true,
  },
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

export const passagierfrequenzen = new MapboxStyleLayer({
  name: 'ch.sbb.bahnhoffrequenzen',
  visible: false,
  mapboxLayer: sourcesLayer,
  styleLayer: {
    id: 'passagierfrequenzen',
    type: 'circle',
    source: 'base',
    'source-layer': 'netzkarte_point',
    filter: ['has', 'dwv'],
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'dwv'],
        400,
        8,
        500000,
        70,
      ],
      'circle-color': 'rgb(255,220,0)',
      'circle-stroke-width': 2,
      'circle-stroke-color': 'rgb(255,220,0)',
      'circle-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.7,
      ],
    },
  },
  properties: {
    hasInfos: true,
    description: 'ch.sbb.bahnhoffrequenzen-desc',
  },
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
  new MapboxStyleLayer({
    name: 'ch.sbb.bahnhofplaene.printprodukte',
    radioGroup: 'bahnhofplaene',
    visible: false,
    mapboxLayer: sourcesLayer,
    styleLayer: {
      id: 'printprodukte',
      type: 'symbol',
      source: 'base',
      'source-layer': 'netzkarte_point',
      layout: {
        'icon-image': 'standort',
        'icon-size': 1,
      },
    },
    properties: {
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.printprodukte-desc',
    },
  }),
  new MapboxStyleLayer({
    name: 'ch.sbb.bahnhofplaene.interaktiv',
    radioGroup: 'bahnhofplaene',
    visible: false,
    mapboxLayer: sourcesLayer,
    styleLayer: {
      id: 'interaktiv',
      type: 'symbol',
      source: 'base',
      'source-layer': 'netzkarte_point',
      filter: ['has', 'url_interactive_plan'],
      layout: {
        'icon-image': 'standort',
        'icon-size': 1,
      },
    },
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

/* export const netzkartePointLayer = new NetzkartePointMapboxStyleLayer({
  key: 'ch.sbb.netzkarte.stationen',
  mapboxLayer: netzkarteLayer,
  visible: false,
  filter: styleLayer => {
    return styleLayer.id === 'netzkarte_point';
  }
}); */

export const netzkartePointLayer = new MapboxStyleLayer({
  key: 'ch.sbb.netzkarte.stationen',
  visible: true,
  mapboxLayer: sourcesLayer,
  styleLayer: {
    id: 'netzkarte_point',
    type: 'circle',
    source: 'base',
    'source-layer': 'netzkarte_point',
    paint: {
      'circle-radius': 10,
      'circle-color': 'rgb(0, 61, 155)',
      'circle-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0,
      ],
    },
  },
  properties: {
    hideInLegend: true,
  },
});

export const buslines = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.buslinien',
  mapboxLayer: sourcesLayer,
  visible: false,
  styleLayer: {
    id: 'bus',
    type: 'line',
    source: 'busline',
    'source-layer': 'busses',
    paint: {
      'line-color': 'rgba(255, 220, 0, 1)',
      'line-width': 3,
      'line-opacity': 1,
    },
  },
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

export const stuetzpunktbahnhoefe = new HandicapLayer({
  name: 'ch.sbb.stuetzpunktbahnhoefe',
  visible: true,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.stuetzpunktbahnhoefe-desc',
  },
});

export default [
  sourcesLayer,
  netzkarteLayer,
  // netzkarteLayerLight,
  // netzkarteLayerNight,
  swisstopoLandeskarteGrau,
  swisstopoLandeskarte,
  aerial,
];
