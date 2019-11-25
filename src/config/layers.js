import proj4 from 'proj4';
import TileLayer from 'ol/layer/Tile';
import WMTSSource from 'ol/source/WMTS';
import TileWMSSource from 'ol/source/TileWMS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import TileGrid from 'ol/tilegrid/TileGrid';
import { register } from 'ol/proj/proj4';
import Layer from 'react-spatial/layers/Layer';
import TrajservLayer from 'react-transit/layers/TrajservLayer';
import HandicapLayer from '../layers/HandicapLayer';
import MapboxStyleLayer from '../layers/MapboxStyleLayer';
import TrafimageGeoServerWMSLayer from '../layers/TrafimageGeoServerWMSLayer';
import TrafimageMapboxLayer from '../layers/TrafimageMapboxLayer';
import ConstructionLayer from '../layers/ConstructionLayer/ConstructionLayer';
import BehigLayer from '../layers/BehigLayer/BehigLayer';

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

export const netzkarteLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  isQueryable: false,
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'trafimage_perimeter_v2',
});

/**
 * This layer create a MapboxLayer used by all the MapboxStyleLayer.
 * Its style file contains only source where to find datas.
 * The style of features are  defined by each MapboxStyleLayer ('netzkarte_point, buslinien,...)
 */
export const sourcesLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.sources',
  zIndex: 1,
  preserveDrawingBuffer: true,
  style: 'trafimage_sources_only',
  properties: {
    hideInLegend: true,
  },
});

export const swisstopoSwissImage = new Layer({
  name: 'ch.sbb.netzkarte.luftbild',
  key: 'ch.sbb.netzkarte.luftbild',
  copyright: 'swisstopo (5704003351)',
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  visible: false,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `//maps.trafimage.ch/geo-admin-wmts/1.0.0/` +
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

export const swisstopoLandeskarte = new Layer({
  name: 'ch.sbb.netzkarte.landeskarte',
  copyright: 'swisstopo (5704003351)',
  visible: false,
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `//maps.trafimage.ch/geo-admin-wmts/1.0.0/` +
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
        `//maps.trafimage.ch/geo-admin-wmts/1.0.0/` +
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
    layerInfoComponent: 'PassagierFrequenzenLayerInfo',
    popupComponent: 'PassagierFrequenzenPopup',
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
      filter: [
        'any',
        ['has', 'url_a4'],
        ['has', 'url_poster'],
        ['has', 'url_shopping'],
      ],
      layout: {
        'icon-image': 'standort',
        'icon-size': 1,
      },
    },
    properties: {
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.printprodukte-desc',
      popupComponent: 'BahnhofplanPopup',
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
      popupComponent: 'BahnhofplanPopup',
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
    layerInfoComponent: 'PunctualityLayerInfo',
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
  name: 'ch.sbb.netzkarte.stationen',
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
    popupComponent: 'NetzkartePopup',
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
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        10,
        3,
      ],
      'line-opacity': 1,
    },
  },
  properties: {
    hasInfos: true,
    layerInfoComponent: 'BuslinesLayerInfo',
    popupComponent: 'BusLinePopup',
  },
});

export const gemeindegrenzen = new TrafimageGeoServerWMSLayer({
  name: 'ch.sbb.ch_gemeinden',
  visible: false,
  olLayer: new TileLayer({
    source: new TileWMSSource({
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

export const parks = new TrafimageGeoServerWMSLayer({
  name: 'ch.sbb.parks',
  visible: false,
  olLayer: new TileLayer({
    source: new TileWMSSource({
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
    layerInfoComponent: 'ParksLayerInfo',
    popupComponent: 'ParksPopup',
  },
});

export const stuetzpunktbahnhoefe = new HandicapLayer({
  name: 'ch.sbb.stuetzpunktbahnhoefe',
  visible: true,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.stuetzpunktbahnhoefe-desc',
    popupComponent: 'HandicapPopup',
  },
});

export const netzkarteShowcasesNight = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.night',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: false,
  radioGroup: 'showcases',
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'showcase2',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.netzkarte.night-desc',
  },
});

export const netzkarteShowcasesLight = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.light',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: false,
  radioGroup: 'showcases',
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'showcase3',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.netzkarte.light-desc',
  },
});

export const netzkarteShowcasesNetzkarte = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.showcases',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  isQueryable: false,
  radioGroup: 'showcases',
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'trafimage_perimeter_v2',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.netzkarte.showcases-desc',
  },
});

export const constrUnterhalt = new Layer({
  name: 'ch.sbb.construction.unterhalt.group',
  desc: 'ch.sbb.construction.unterhalt.group-desc',
  visible: true,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.construction.unterhalt.group-desc',
  },
  children: [
    new Layer({
      name: 'ch.sbb.construction.unterhalt.uebrige',
      key: 'ch.sbb.construction.unterhalt.uebrige',
      visible: true,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        construction: {
          art: 'Unterhalt',
          ort: 'Übrige Standorte',
        },
      },
    }),
    new Layer({
      name: 'ch.sbb.construction.unterhalt.bahnhof_strecke',
      key: 'ch.sbb.construction.unterhalt.bahnhof_strecke',
      visible: true,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        construction: {
          art: 'Unterhalt',
          ort: 'Bahnhof und Strecke',
        },
      },
    }),
    new Layer({
      name: 'ch.sbb.construction.unterhalt.strecke',
      key: 'ch.sbb.construction.unterhalt.strecke',
      visible: true,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        construction: {
          art: 'Unterhalt',
          ort: 'Strecke',
        },
      },
    }),
    new Layer({
      name: 'ch.sbb.construction.unterhalt.bahnhof',
      key: 'ch.sbb.construction.unterhalt.bahnhof',
      visible: true,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        construction: {
          art: 'Unterhalt',
          ort: 'Bahnhof',
        },
      },
    }),
  ],
});

export const constrAusbau = new Layer({
  name: 'ch.sbb.construction.ausbau.group',
  desc: 'ch.sbb.construction.ausbau.group-desc',
  visible: true,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.construction.ausbau.group-desc',
  },
  children: [
    new Layer({
      name: 'ch.sbb.construction.ausbau.uebrige',
      key: 'ch.sbb.construction.ausbau.uebrige',
      visible: true,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        construction: {
          art: 'Ausbau',
          ort: 'Übrige Standorte',
        },
      },
    }),
    new Layer({
      name: 'ch.sbb.construction.ausbau.bahnhof_strecke',
      key: 'ch.sbb.construction.ausbau.bahnhof_strecke',
      visible: true,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        construction: {
          art: 'Ausbau',
          ort: 'Bahnhof und Strecke',
        },
      },
    }),
    new Layer({
      name: 'ch.sbb.construction.ausbau.strecke',
      key: 'ch.sbb.construction.ausbau.strecke',
      visible: true,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        construction: {
          art: 'Ausbau',
          ort: 'Strecke',
        },
      },
    }),
    new Layer({
      name: 'ch.sbb.construction.ausbau.bahnhof',
      key: 'ch.sbb.construction.ausbau.bahnhof',
      visible: true,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        construction: {
          art: 'Ausbau',
          ort: 'Bahnhof',
        },
      },
    }),
  ],
});

export const constrSingleLayer = new ConstructionLayer({
  name: 'ch.sbb.construction.single',
  key: 'ch.sbb.construction.single',
  visible: true,
  properties: {
    hideInLegend: true,
    popupComponent: 'ConstructionPopup',
  },
  children: [constrUnterhalt, constrAusbau],
  maxResolution: 305.748113141,
});

export const constrClusterLayer = new ConstructionLayer({
  name: 'ch.sbb.construction.cluster',
  key: 'ch.sbb.construction.cluster',
  visible: true,
  properties: {
    hideInLegend: true,
    popupComponent: 'ConstructionPopup',
    cluster: true,
  },
  children: [constrUnterhalt, constrAusbau],
  minResolution: 305.748113141,
});

export const behigOk = new Layer({
  name: 'ch.sbb.behig.ok',
  key: 'ch.sbb.behig.ok',
  visible: true,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'BehigLayerInfo',
    behig: {
      status: 'OK',
    },
  },
});

export const behigNotYetOk = new Layer({
  name: 'ch.sbb.behig.not_yet_ok',
  key: 'ch.sbb.behig.not_yet_ok',
  visible: true,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'BehigLayerInfo',
    behig: {
      status: 'NOCH NICHT OK',
    },
  },
});

export const behigNotOk = new Layer({
  name: 'ch.sbb.behig.not_ok',
  key: 'ch.sbb.behig.not_ok',
  visible: true,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'BehigLayerInfo',
    behig: {
      status: 'BLEIBEN NICHT OK',
    },
  },
});

export const behigParent = new BehigLayer({
  name: 'ch.sbb.behig.parent',
  key: 'ch.sbb.behig.parent',
  visible: true,
  properties: {
    hideInLegend: true,
    popupComponent: 'BehigPopup',
  },
  children: [behigOk, behigNotYetOk, behigNotOk],
});

export default [
  sourcesLayer,
  netzkarteLayer,
  swisstopoLandeskarteGrau,
  swisstopoLandeskarte,
  swisstopoSwissImage,
];
