import proj4 from 'proj4';
import TileLayer from 'ol/layer/Tile';
import TileWMSSource from 'ol/source/TileWMS';
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

export const dataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.data',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'netzkarte_personenverkehr_v2',
  properties: {
    hideInLegend: true,
  },
});

let osmPointsLayers = [];
let osmPointsFeaturesRendered = [];

// Get list of styleLayers applied to osm_points source.
dataLayer.on('load', () => {
  osmPointsLayers = dataLayer.mbMap
    .getStyle()
    .layers.filter(layer => {
      return (
        layer['source-layer'] === 'osm_points' && layer.id !== 'osm_points'
      );
    })
    .map(layer => layer.id);
});

export const sourcesLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.sources',
  zIndex: 1,
  preserveDrawingBuffer: true,
  style: 'trafimage_sources_only_v2',
  properties: {
    hideInLegend: true,
  },
});

sourcesLayer.on('load', () => {
  if (sourcesLayer.mbMap && !sourcesLayer.mbMap.getSource('stations')) {
    sourcesLayer.mbMap.addSource('stations', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: osmPointsFeaturesRendered,
      },
    });
  }
});

// On initilialization we get the lit of rendered stations.
dataLayer.on('init', () => {
  dataLayer.mbMap.on('idle', () => {
    osmPointsFeaturesRendered = dataLayer.mbMap
      .queryRenderedFeatures({
        layers: osmPointsLayers,
      })
      .map(feat => {
        const good = {
          id: feat.id * 1000,
          type: feat.type,
          properties: feat.properties,
          geometry: feat.geometry,
        };
        return good;
      });

    if (sourcesLayer.mbMap && sourcesLayer.mbMap.getSource('stations')) {
      sourcesLayer.mbMap.getSource('stations').setData({
        type: 'FeatureCollection',
        features: osmPointsFeaturesRendered,
      });
    }
  });
});

export const netzkarteLayer = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  visible: true,
  mapboxLayer: dataLayer,
  styleLayersFilter: () => {
    return false;
  },
});

export const swisstopoSwissImage = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.luftbild.group',
  key: 'ch.sbb.netzkarte.luftbild.group',
  copyright: 'swisstopo (5704003351)',
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: styleLayer => {
    return /(swissimage|netzkarte)/.test(styleLayer.id);
  },
});

export const swisstopoLandeskarte = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.landeskarte',
  copyright: 'swisstopo (5704003351)',
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: styleLayer => {
    return /pixelkarte_farbe/.test(styleLayer.id);
  },
});

export const swisstopoLandeskarteGrau = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.landeskarte.grau',
  copyright: 'swisstopo (5704003351)',
  isBaseLayer: true,
  radioGroup: 'baseLayer',
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: styleLayer => {
    return /pixelkarte_grau/.test(styleLayer.id);
  },
});

export const passagierfrequenzen = new MapboxStyleLayer({
  name: 'ch.sbb.bahnhoffrequenzen',
  visible: false,
  mapboxLayer: sourcesLayer,
  styleLayer: {
    id: 'passagierfrequenzen',
    type: 'circle',
    source: 'stations',
    // source: 'base',
    // 'source-layer': 'osm_points',
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
    name: 'ch.sbb.bahnhofplaene.interaktiv',
    radioGroup: 'bahnhofplaene',
    visible: false,
    mapboxLayer: sourcesLayer,
    styleLayer: {
      id: 'interaktiv',
      type: 'symbol',
      source: 'stations',
      filter: ['has', 'url_interactive_plan'],
      layout: {
        'icon-image': 'standort',
        'icon-size': 1,
      },
    },
    filters: ['has', 'url_interactive_plan'],
    properties: {
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.interaktiv-desc',
      popupComponent: 'BahnhofplanPopup',
    },
  }),
  new MapboxStyleLayer({
    name: 'ch.sbb.bahnhofplaene.printprodukte',
    radioGroup: 'bahnhofplaene',
    visible: true,
    mapboxLayer: sourcesLayer,
    styleLayer: {
      id: 'printprodukte',
      type: 'symbol',
      source: 'stations',
      layout: {
        'icon-image': 'standort',
        'icon-size': 1,
      },
    },
    filters: [
      'any',
      ['has', 'url_a4'],
      ['has', 'url_poster'],
      ['has', 'url_shopping'],
    ],
    properties: {
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.printprodukte-desc',
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

punctuality.setChildren([
  new TrajservLayer({
    name: 'ch.sbb.puenktlichkeit-nv',
    visible: false,
    useDelayStyle: true,
    radioGroup: 'ch.sbb.punctuality',
    regexPublishedLineName: '^(S|R$|RE|PE|D|IRE|RB|TER)',
  }),
  new TrajservLayer({
    name: 'ch.sbb.puenktlichkeit-fv',
    visible: false,
    useDelayStyle: true,
    radioGroup: 'ch.sbb.punctuality',
    regexPublishedLineName: '(IR|IC|EC|RJX|TGV)',
  }),
  new TrajservLayer({
    name: 'ch.sbb.puenktlichkeit-all',
    visible: false,
    useDelayStyle: true,
    radioGroup: 'ch.sbb.punctuality',
  }),
]);

export const netzkartePointLayer = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.stationen',
  visible: true,
  mapboxLayer: sourcesLayer,
  styleLayer: {
    id: 'stations',
    type: 'circle',
    source: 'stations',
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
    layerInfoComponent: 'StuetzpunktLayerInfo',
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
  name: 'ch.sbb.netzkarte',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  isQueryable: false,
  radioGroup: 'showcases',
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'netzkarte_personenverkehr',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.netzkarte-desc',
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

export const constructionLayer = new ConstructionLayer({
  name: 'ch.sbb.construction.data',
  key: 'ch.sbb.construction.data',
  visible: true,
  properties: {
    hideInLegend: true,
    popupComponent: 'ConstructionPopup',
  },
  toggleLayers: [constrUnterhalt, constrAusbau],
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
  toggleLayers: [behigOk, behigNotYetOk, behigNotOk],
});

export default [
  dataLayer,
  sourcesLayer,
  netzkarteLayer,
  swisstopoLandeskarteGrau,
  swisstopoLandeskarte,
  swisstopoSwissImage,
];
