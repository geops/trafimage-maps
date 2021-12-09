import proj4 from 'proj4';
import { unByKey } from 'ol/Observable';
import { register } from 'ol/proj/proj4';
import { Layer } from 'mobility-toolbox-js/ol';
import GeometryType from 'ol/geom/GeometryType';
import MapboxStyleLayer from '../layers/MapboxStyleLayer';
import TrafimageMapboxLayer from '../layers/TrafimageMapboxLayer';
import KilometrageLayer from '../layers/KilometrageLayer';
import netzkarte from '../img/netzkarte.png';
import netzkarteNightImg from '../img/netzkarte_night.png';
import landeskarte from '../img/landeskarte.png';
import landeskarteGrau from '../img/landeskarte_grau.png';
import luftbild from '../img/luftbild.png';
import AusbauLayer from '../layers/AusbauLayer';
import ZweitausbildungAbroadLayer from '../layers/ZweitausbildungAbroadLayer';
import ZweitausbildungPoisLayer from '../layers/ZweitausbildungPoisLayer';
import ZweitausbildungRoutesLayer from '../layers/ZweitausbildungRoutesLayer';
import ZweitausbildungRoutesHighlightLayer from '../layers/ZweitausbildungRoutesHighlightLayer';
import TarifverbundkarteLayer from '../layers/TarifverbundkarteLayer';
import StationsLayer from '../layers/StationsLayer';
import PlatformsLayer from '../layers/PlatformsLayer';
import TralisLayer from '../layers/TralisLayer';

proj4.defs(
  'EPSG:21781',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
    '+x_0=600000 +y_0=200000 +ellps=bessel ' +
    '+towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
);

proj4.defs(
  'EPSG:2056',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
    '+x_0=2600000 +y_0=1200000 +ellps=bessel ' +
    '+towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
);

register(proj4);

export const dataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.data',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2',
  properties: {
    hideInLegend: true,
  },
});

export const handicapDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.handicap.data',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'ch.sbb.handicap',
  properties: {
    hideInLegend: true,
  },
});

export const tarifverbundkarteDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.tarifverbundkarte.data',
  visible: true,
  preserveDrawingBuffer: true,
  isBaseLayer: true,
  isQueryable: false,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'ch.sbb.tarifverbund',
  properties: {
    hideInLegend: true,
  },
});

let osmPointsLayers = [];
const olListenersKeys = [];

const updateStations = (mbMap) => {
  // Modifying the source triggers an idle state so we use "once" to avoid an infinite loop.
  mbMap.once('idle', () => {
    const osmPointsRendered = mbMap
      .queryRenderedFeatures({
        layers: osmPointsLayers,
      })
      .map((feat) => {
        const good = {
          id: feat.id * 1000,
          type: feat.type,
          properties: feat.properties,
          geometry: feat.geometry,
        };
        return good;
      });
    const source = mbMap.getSource('stations');
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: osmPointsRendered,
      });
    }
  });
};

// Get list of styleLayers applied to osm_points source.
// We don"t use "once()" because when switching topics
// (ex: netzkarte->eisenbahn->netzkarte), the layer is removed then reloaded.
dataLayer.on('load', () => {
  const { map, mbMap } = dataLayer;
  osmPointsLayers = mbMap
    .getStyle()
    .layers.filter((layer) => {
      return (
        layer['source-layer'] === 'osm_points' && layer.id !== 'osm_points'
      );
    })
    .map((layer) => layer.id);

  if (!mbMap.getSource('stations')) {
    mbMap.addSource('stations', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
  }
  updateStations(mbMap);

  // Update stations source on moveeend.
  unByKey(olListenersKeys);
  olListenersKeys.push(
    map.on('moveend', () => {
      updateStations(mbMap);
    }),
  );
});

export const netzkarteLayer = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.layer',
  key: 'ch.sbb.netzkarte',
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
    previewImage: netzkarte,
  },
  visible: true,
  mapboxLayer: dataLayer,
  styleLayersFilter: (styleLayer) => {
    return /perimeter_mask$/.test(styleLayer.id);
  },
  style: 'base_bright_v2',
});

export const netzkarteNight = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.dark',
  key: 'ch.sbb.netzkarte.dark',
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
    previewImage: netzkarteNightImg,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'base_dark_v2',
});

export const swisstopoSwissImage = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.luftbild.group',
  key: 'ch.sbb.netzkarte.luftbild.group',
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
    previewImage: luftbild,
  },
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: (styleLayer) => {
    return /(swissimage|netzkarte)/.test(styleLayer.id);
  },
});

export const swisstopoLandeskarte = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.landeskarte',
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
    previewImage: landeskarte,
  },
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: (styleLayer) => {
    return /img_PK_farbe/.test(styleLayer.id);
  },
});

export const swisstopoLandeskarteGrau = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.landeskarte.grau',
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
    previewImage: landeskarteGrau,
  },
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: (styleLayer) => {
    return /img_PK_grau/.test(styleLayer.id);
  },
});

export const passagierfrequenzen = new MapboxStyleLayer({
  name: 'ch.sbb.bahnhoffrequenzen',
  visible: false,
  mapboxLayer: dataLayer,
  styleLayer: {
    id: 'passagierfrequenzen',
    type: 'circle',
    source: 'stations',
    filter: ['has', 'dwv'],
    paint: {
      'circle-radius': ['*', ['sqrt', ['/', ['get', 'dwv'], Math.PI]], 0.2], // Radius = (sqrt(passengers/Math.PI))*0.2 (0.2 is a constant)
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
  isQueryable: false,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.bahnhofplaene-desc',
  },
});
bahnhofplaene.children = [
  new MapboxStyleLayer({
    name: 'ch.sbb.bahnhofplaene.interaktiv',
    visible: false,
    mapboxLayer: dataLayer,
    styleLayer: {
      id: 'interaktiv',
      type: 'symbol',
      source: 'stations',
      filter: ['has', 'url_interactive_plan'],
      layout: {
        'icon-image': 'standort',
        'icon-ignore-placement': true,
      },
    },
    properties: {
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.interaktiv-desc',
      popupComponent: 'BahnhofplanPopup',
      radioGroup: 'bahnhofplaene',
    },
  }),
  new MapboxStyleLayer({
    name: 'ch.sbb.bahnhofplaene.printprodukte',
    visible: false,
    mapboxLayer: dataLayer,
    styleLayer: {
      id: 'printprodukte',
      type: 'symbol',
      source: 'stations',
      filter: [
        'any',
        ['has', 'url_a4'],
        ['has', 'url_poster'],
        ['has', 'url_shopping'],
      ],
      layout: {
        'icon-image': 'standort',
        'icon-ignore-placement': true,
      },
    },
    properties: {
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.printprodukte-desc',
      popupComponent: 'BahnhofplanPopup',
      radioGroup: 'bahnhofplaene',
    },
  }),
];

export const punctuality = new Layer({
  name: 'ch.sbb.puenktlichkeit',
  visible: false,
  isQueryable: false,
  properties: {
    hasAccessibility: true,
    hasInfos: true,
    layerInfoComponent: 'PunctualityLayerInfo',
  },
});

punctuality.children = [
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-nv',
    visible: false,
    useDelayStyle: true,
    tenant: 'sbb',
    minZoomNonTrain: 14,
    regexPublishedLineName: '^(S|R$|RE|PE|D|IRE|RB|TER)',
    properties: {
      radioGroup: 'ch.sbb.punctuality',
    },
  }),
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-fv',
    visible: false,
    useDelayStyle: true,
    tenant: 'sbb',
    minZoomNonTrain: 14,
    regexPublishedLineName: '(IR|IC|EC|RJX|TGV)',
    properties: {
      radioGroup: 'ch.sbb.punctuality',
    },
  }),
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-all',
    visible: false,
    useDelayStyle: true,
    tenant: 'sbb',
    minZoomNonTrain: 14,
    properties: {
      radioGroup: 'ch.sbb.punctuality',
    },
  }),
];

export const netzkartePointLayer = new StationsLayer({
  name: 'ch.sbb.netzkarte.stationen',
  mapboxLayer: dataLayer,
});

export const platformsLayer = new PlatformsLayer({
  name: 'ch.sbb.netzkarte.platforms',
  mapboxLayer: dataLayer,
});

export const buslines = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.buslinien',
  mapboxLayer: dataLayer,
  visible: false,
  styleLayer: {
    id: 'bus',
    type: 'line',
    source: 'busses',
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

export const gemeindegrenzen = new MapboxStyleLayer({
  name: 'ch.sbb.ch_gemeinden',
  mapboxLayer: dataLayer,
  visible: false,
  isQueryable: false,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['trafimage.filter'] === 'municipality_borders',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.ch_gemeinden-desc',
  },
});

export const stuetzpunktBahnhoefe = new MapboxStyleLayer({
  name: 'ch.sbb.stuetzpunktbahnhoefe',
  key: 'ch.sbb.stuetzpunktbahnhoefe',
  visible: true,
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ id }) => /stuetzpunkt/.test(id),
  queryRenderedLayersFilter: ({ id }) => /stuetzpunkt/.test(id),
  styleLayer: {
    id: 'ch.sbb.stuetzpunktbahnhoefe',
    type: 'symbol',
    source: 'ch.sbb.handicap',
    'source-layer': 'ch.sbb.handicap',
  },
  properties: {
    handicapType: 'stuetzpunkt',
    hasInfos: true,
    layerInfoComponent: 'HandicapLayerInfo',
    popupComponent: 'HandicapPopup',
  },
  hidePopup: (feat, layer, featureInfo) => {
    const otherFeatsClicked = featureInfo
      .filter((info) => info.layer !== layer)
      .map((info) => info.features)
      .flat()
      .map((f) => f.get('stationsbezeichnung'));

    return otherFeatsClicked.includes(feat.get('stationsbezeichnung'));
  },
});

export const barrierfreierBahnhoefe = new MapboxStyleLayer({
  name: 'ch.sbb.barrierfreierbahnhoefe',
  key: 'ch.sbb.barrierfreierbahnhoefe',
  visible: true,
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ id }) => /^barrierefrei/.test(id),
  queryRenderedLayersFilter: ({ id }) => /^barrierefrei/.test(id),
  styleLayer: {
    id: 'ch.sbb.barrierfreierbahnhoefe',
    type: 'symbol',
    source: 'ch.sbb.handicap',
    'source-layer': 'ch.sbb.handicap',
  },
  properties: {
    handicapType: 'barrierfree',
    hasInfos: true,
    layerInfoComponent: 'HandicapLayerInfo',
    popupComponent: 'HandicapPopup',
  },
});

export const nichtBarrierfreierBahnhoefe = new MapboxStyleLayer({
  name: 'ch.sbb.nichtbarrierfreierbahnhoefe',
  key: 'ch.sbb.nichtbarrierfreierbahnhoefe',
  visible: true,
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ id }) => /^nicht_barrierefrei/.test(id),
  queryRenderedLayersFilter: ({ id }) => /^nicht_barrierefrei/.test(id),
  styleLayer: {
    id: 'ch.sbb.nichtbarrierfreierbahnhoefe',
    type: 'symbol',
    source: 'ch.sbb.handicap',
    'source-layer': 'ch.sbb.handicap',
  },
  properties: {
    handicapType: 'notBarrierfree',
    hasInfos: true,
    layerInfoComponent: 'HandicapLayerInfo',
    popupComponent: 'HandicapPopup',
  },
});

export const netzkarteShowcasesNight = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.night',
  key: 'ch.sbb.netzkarte.night',
  visible: false,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_dark_v2',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.netzkarte.night-desc',
    radioGroup: 'showcases',
  },
});

export const netzkarteShowcasesLight = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.light',
  key: 'ch.sbb.netzkarte.light',
  visible: true,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'showcase3',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.netzkarte.light-desc',
    radioGroup: 'showcases',
  },
});

export const netzkarteShowcasesNetzkarte = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.layer',
  key: 'ch.sbb.netzkarte.layer',
  visible: false,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.netzkarte-desc',
    radioGroup: 'showcases',
  },
});

export const kilometrageLayer = new KilometrageLayer({
  name: 'ch.sbb.kilometrage',
  key: 'ch.sbb.kilometrage',
  visible: true,
  properties: {
    hideInLegend: true,
    featureInfoEventTypes: ['singleclick'],
    popupComponent: 'KilometragePopup',
  },
});

export const constructionDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.construction.data',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'ch.sbb.bauprojekte',
  properties: {
    hideInLegend: true,
  },
});

export const constrAusbau = new AusbauLayer({
  name: 'ch.sbb.construction.ausbau.group',
  desc: 'ch.sbb.construction.ausbau.group-desc',
  visible: true,
  mapboxLayer: constructionDataLayer,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.construction.ausbau.group-desc',
    filtersComponent: 'AusbauFilters',
  },
  children: [
    new MapboxStyleLayer({
      name: 'ch.sbb.construction.ausbau.uebrige',
      key: 'ch.sbb.construction.ausbau.uebrige',
      visible: true,
      mapboxLayer: constructionDataLayer,
      styleLayersFilter: ({ id }) => /ausbau.uebrige/.test(id),
      queryRenderedLayersFilter: ({ id }) => /ausbau.uebrige/.test(id),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        popupComponent: 'ConstructionPopup',
        construction: {
          art: 'Ausbau',
          ort: 'Übrige Standorte',
        },
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.construction.ausbau.bahnhof_strecke',
      key: 'ch.sbb.construction.ausbau.bahnhof_strecke',
      visible: true,
      mapboxLayer: constructionDataLayer,
      styleLayersFilter: ({ id }) => /ausbau.bahnhof_strecke/.test(id),
      queryRenderedLayersFilter: ({ id }) => /ausbau.bahnhof_strecke/.test(id),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        popupComponent: 'ConstructionPopup',
        construction: {
          art: 'Ausbau',
          ort: 'Bahnhof und Strecke',
        },
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.construction.ausbau.strecke',
      key: 'ch.sbb.construction.ausbau.strecke',
      visible: true,
      mapboxLayer: constructionDataLayer,
      styleLayersFilter: ({ id }) => /ausbau.strecke/.test(id),
      queryRenderedLayersFilter: ({ id }) => /ausbau.strecke/.test(id),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        popupComponent: 'ConstructionPopup',
        construction: {
          art: 'Ausbau',
          ort: 'Strecke',
        },
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.construction.ausbau.bahnhof',
      key: 'ch.sbb.construction.ausbau.bahnhof',
      visible: true,
      mapboxLayer: constructionDataLayer,
      styleLayersFilter: ({ id }) => /ausbau.bahnhof$/.test(id),
      queryRenderedLayersFilter: ({ id }) => /ausbau.bahnhof$/.test(id),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        popupComponent: 'ConstructionPopup',
        construction: {
          art: 'Ausbau',
          ort: 'Bahnhof',
        },
      },
    }),
  ],
});

export const constrUnterhalt = new Layer({
  name: 'ch.sbb.construction.unterhalt.group',
  desc: 'ch.sbb.construction.unterhalt.group-desc',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.construction.unterhalt.group-desc',
  },
  children: [
    new MapboxStyleLayer({
      name: 'ch.sbb.construction.unterhalt.uebrige',
      key: 'ch.sbb.construction.unterhalt.uebrige',
      visible: true,
      mapboxLayer: constructionDataLayer,
      styleLayersFilter: ({ id }) => /unterhalt.uebrige/.test(id),
      queryRenderedLayersFilter: ({ id }) => /unterhalt.uebrige/.test(id),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        popupComponent: 'ConstructionPopup',
        construction: {
          art: 'Unterhalt',
          ort: 'Übrige Standorte',
        },
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.construction.unterhalt.bahnhof_strecke',
      key: 'ch.sbb.construction.unterhalt.bahnhof_strecke',
      visible: true,
      mapboxLayer: constructionDataLayer,
      styleLayersFilter: ({ id }) => /unterhalt.bahnhof_strecke/.test(id),
      queryRenderedLayersFilter: ({ id }) =>
        /unterhalt.bahnhof_strecke/.test(id),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        popupComponent: 'ConstructionPopup',
        construction: {
          art: 'Unterhalt',
          ort: 'Bahnhof und Strecke',
        },
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.construction.unterhalt.strecke',
      key: 'ch.sbb.construction.unterhalt.strecke',
      visible: true,
      mapboxLayer: constructionDataLayer,
      styleLayersFilter: ({ id }) => /unterhalt.strecke/.test(id),
      queryRenderedLayersFilter: ({ id }) => /unterhalt.strecke/.test(id),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        popupComponent: 'ConstructionPopup',
        construction: {
          art: 'Unterhalt',
          ort: 'Strecke',
        },
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.construction.unterhalt.bahnhof',
      key: 'ch.sbb.construction.unterhalt.bahnhof',
      visible: true,
      mapboxLayer: constructionDataLayer,
      styleLayersFilter: ({ id }) => /unterhalt.bahnhof$/.test(id),
      queryRenderedLayersFilter: ({ id }) => /unterhalt.bahnhof$/.test(id),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ConstructionLayerInfo',
        popupComponent: 'ConstructionPopup',
        construction: {
          art: 'Unterhalt',
          ort: 'Bahnhof',
        },
      },
    }),
  ],
});

let constrLayers = [];

export const updateConstructions = (mbMap) => {
  // Modifying the source triggers an idle state so we use "once" to avoid an infinite loop.
  mbMap.once('idle', () => {
    const constrRendered = mbMap
      .queryRenderedFeatures({
        layers: constrLayers,
      })
      .map((feat) => {
        const good = {
          id: feat.id * 1000,
          type: feat.type,
          properties: feat.properties,
          geometry: feat.geometry,
        };
        return good;
      });
    const source = mbMap.getSource('clusters');
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: constrRendered,
      });
    }
  });
};

const constrOlListenersKeys = [];
constructionDataLayer.on('load', () => {
  const { map, mbMap } = constructionDataLayer;
  constrLayers = mbMap
    .getStyle()
    .layers.filter((layer) => {
      return (
        layer['source-layer'] === 'ch.sbb.bauprojekte' &&
        /(ausbau|unterhalt)/.test(layer.id)
      );
    })
    .map((layer) => layer.id);

  if (!mbMap.getSource('clusters')) {
    mbMap.addSource('clusters', {
      type: 'geojson',
      cluster: true,
      clusterRadius: 75, // Radius of each cluster when clustering points.
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
  }
  updateConstructions(mbMap);

  // Update clusters source on moveeend.
  unByKey(constrOlListenersKeys);

  constrOlListenersKeys.push(
    map.on('moveend', () => {
      updateConstructions(mbMap);
    }),
  );
});

// Re-render cluster when change construction layers visiblity.
[constrAusbau, constrUnterhalt].forEach((parentLayer) => {
  parentLayer.children.forEach((l) => {
    l.on('change:visible', ({ target: layer }) => {
      // Re-render only for children that contribute to the cluster
      if (
        layer.mapboxLayer &&
        constructionDataLayer &&
        constructionDataLayer.mbMap
      ) {
        updateConstructions(layer.mapboxLayer.mbMap);
      }
    });
  });
});

export const constrClusters = new Layer({
  name: 'ch.sbb.construction-clusters',
  key: 'ch.sbb.construction-clusters',
  visible: true,
  isQueryable: false,
  properties: {
    hideInLegend: true,
  },
  children: [
    new MapboxStyleLayer({
      name: 'ch.sbb.construction-cluster-circle',
      key: 'ch.sbb.construction-cluster-circle',
      visible: true,
      mapboxLayer: constructionDataLayer,
      properties: {
        popupComponent: 'ConstructionPopup',
      },
      styleLayer: {
        id: 'constr-cluster-circle',
        type: 'circle',
        source: 'clusters',
        maxzoom: 8,
        paint: {
          'circle-color': 'rgb(0, 61, 133)',
          'circle-opacity': 0.8,
          'circle-radius': [
            'case',
            ['has', 'point_count'],
            [
              'step',
              ['get', 'point_count'],
              19,
              2,
              20,
              5,
              22,
              6,
              26,
              10,
              30,
              15,
              40,
            ],
            16,
          ],
        },
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.construction-cluster-number',
      key: 'ch.sbb.construction-cluster-number',
      visible: true,
      mapboxLayer: constructionDataLayer,
      styleLayer: {
        id: 'constr-cluster-number',
        type: 'symbol',
        source: 'clusters',
        maxzoom: 8,
        layout: {
          'text-field': [
            'case',
            ['has', 'point_count'],
            ['get', 'point_count'],
            '1',
          ],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 13,
        },
        paint: {
          'text-color': '#ffffff',
        },
      },
    }),
  ],
});

export const netzkarteEisenbahninfrastruktur = new TrafimageMapboxLayer({
  name: 'ch.sbb.infrastruktur',
  isBaseLayer: true,
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'netzkarte_eisenbahninfrastruktur_v3',
  properties: {
    hasInfos: true,
    layerInfoComponent: 'InfrastrukturTopicInfo',
  },
});

export const betriebsRegionen = new MapboxStyleLayer({
  name: 'ch.sbb.betriebsregionen',
  visible: false,
  mapboxLayer: netzkarteEisenbahninfrastruktur,
  styleLayersFilter: ({ id }) => /pattern_/.test(id),
  queryRenderedLayersFilter: ({ id }) => /pattern_/.test(id),
  properties: {
    hasInfos: true,
    popupComponent: 'BetriebsRegionenPopup',
    layerInfoComponent: 'BetriebsRegionenLayerInfo',
  },
});

// Clone layer to set visibility true by default for appName="betriebsregionen" [TRAFDIV-421]
export const betriebsRegionenVisible = new MapboxStyleLayer({
  name: 'ch.sbb.betriebsregionen',
  visible: true,
  mapboxLayer: netzkarteEisenbahninfrastruktur,
  styleLayersFilter: ({ id }) => /pattern_/.test(id),
  queryRenderedLayersFilter: ({ id }) => /pattern_/.test(id),
  properties: {
    hasInfos: true,
    popupComponent: 'BetriebsRegionenPopup',
    layerInfoComponent: 'BetriebsRegionenLayerInfo',
  },
});

export const tochtergesellschaftenSBB = new MapboxStyleLayer({
  name: 'ch.sbb.infrastruktur.tochtergesellschaften.group',
  visible: true,
  mapboxLayer: netzkarteEisenbahninfrastruktur,
  styleLayersFilter: ({ id }) => {
    // negative look behind regex doesn"t work on all browsers.
    return /_SBB/.test(id) && id.indexOf('_only_') === -1;
  },
  properties: {
    hasInfos: true,
    description: 'ch.sbb.infrastruktur.tochtergesellschaften.group-desc',
  },
});

export const gewässer = new MapboxStyleLayer({
  name: 'ch.sbb.infrastruktur.gewaesser.group',
  visible: true,
  mapboxLayer: netzkarteEisenbahninfrastruktur,
  styleLayersFilter: (styleLayer) => {
    return /waters/.test(styleLayer.id);
  },
  properties: {
    hasInfos: true,
    description: 'ch.sbb.infrastruktur.gewaesser.group-desc',
  },
});

export const uebrigeBahnen = new MapboxStyleLayer({
  name: 'ch.sbb.infrastruktur.uebrigebahnen.group',
  visible: true,
  mapboxLayer: netzkarteEisenbahninfrastruktur,
  styleLayersFilter: ({ id }) => {
    // negative look behind regex doesn"t work on all browsers.
    return /_KTU/.test(id) && id.indexOf('_only_') === -1;
  },
  properties: {
    hasInfos: true,
    description: 'ch.sbb.infrastruktur.uebrigebahnen.group-desc',
  },
});

export const grenzen = new Layer({
  name: 'ch.sbb.infrastruktur.grenzen.group',
  visible: false,
  isQueryable: false,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.infrastruktur.grenzen.group',
  },
  children: [
    new Layer({
      name: 'ch.sbb.infrastruktur.gemeindegrenzen.group',
      visible: false,
      isQueryable: false,
      properties: {
        hasInfos: true,
        description: 'ch.sbb.infrastruktur.gemeindegrenzen.group-desc',
      },
      children: [
        new MapboxStyleLayer({
          name: 'ch.sbb.infrastruktur.gemeindegrenzen.greengrenzen',
          visible: false,
          isQueryable: false,
          mapboxLayer: netzkarteEisenbahninfrastruktur,
          styleLayersFilter: (styleLayer) => {
            return /(border_Gemeinde|border_Gemeinde-IMAGICO)$/.test(
              styleLayer.id,
            );
          },
          properties: {
            hasInfos: true,
            description: 'ch.sbb.infrastruktur.gemeindegrenzen.greengrenzen',
            radioGroup: 'ch.sbb.infrastruktur.gemeindegrenzen.group',
          },
        }),
        new MapboxStyleLayer({
          name: 'ch.sbb.infrastruktur.gemeindegrenzen.greygrenzen',
          visible: false,
          isQueryable: false,
          mapboxLayer: netzkarteEisenbahninfrastruktur,
          styleLayersFilter: (styleLayer) => {
            return /(border_Gemeinde-Grey|border_Gemeinde-IMAGICO-Grey)$/.test(
              styleLayer.id,
            );
          },
          properties: {
            hasInfos: true,
            description: 'ch.sbb.infrastruktur.gemeindegrenzen.greygrenzen',
            radioGroup: 'ch.sbb.infrastruktur.gemeindegrenzen.group',
          },
        }),
      ],
    }),
    new Layer({
      name: 'ch.sbb.infrastruktur.kantonsgrenzen.group',
      visible: false,
      isQueryable: false,
      properties: {
        hasInfos: true,
        description: 'ch.sbb.infrastruktur.kantonsgrenzen.group-desc',
      },
      children: [
        new MapboxStyleLayer({
          name: 'ch.sbb.infrastruktur.kantonsgrenzen.greengrenzen',
          visible: false,
          isQueryable: false,
          mapboxLayer: netzkarteEisenbahninfrastruktur,
          styleLayersFilter: (styleLayer) => {
            return /(border_Kanton|border_Kanton-IMAGICO)$/.test(styleLayer.id);
          },
          properties: {
            hasInfos: true,
            description: 'ch.sbb.infrastruktur.kantonsgrenzen.greengrenzen',
            radioGroup: 'ch.sbb.infrastruktur.kantonsgrenzen.group',
          },
        }),
        new MapboxStyleLayer({
          name: 'ch.sbb.infrastruktur.kantonsgrenzen.greygrenzen',
          visible: false,
          isQueryable: false,
          mapboxLayer: netzkarteEisenbahninfrastruktur,
          styleLayersFilter: (styleLayer) => {
            return /(border_Kanton-Grey|border_Kanton-IMAGICO-Grey)$/.test(
              styleLayer.id,
            );
          },
          properties: {
            hasInfos: true,
            description: 'ch.sbb.infrastruktur.kantonsgrenzen.greygrenzen',
            radioGroup: 'ch.sbb.infrastruktur.kantonsgrenzen.group',
          },
        }),
      ],
    }),
  ],
});

export const zweitausbildungAbroad = new ZweitausbildungAbroadLayer({
  name: 'ch.sbb.zweitausbildung.abroad',
  key: 'ch.sbb.zweitausbildung.abroad',
  visible: true,
  zIndex: 2,
  properties: {
    popupComponent: 'ZweitausbildungAbroadPopup',
    hasInfos: true,
    layerInfoComponent: 'ZweitausbildungLayerInfo',
    zweitausbildung: {
      infos: {
        title: 'ch.sbb.zweitausbildung.abroad-title',
        legend: {
          image: 'button_rectangle.png',
          name: 'ch.sbb.zweitausbildung.abroad-name',
        },
      },
    },
  },
});

export const zweitausbildungStationsDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.zweitausbildung_stations',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'ch.sbb.zweitausbildung_stations',
  properties: {
    hideInLegend: true,
  },
});

export const zweitausbildungStations = new Layer({
  name: 'ch.sbb.zweitausbildung.stationen.group',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'ZweitausbildungLayerInfo',
    zweitausbildung: {
      infos: {
        title: 'ch.sbb.zweitausbildung.stationen.group-title',
      },
    },
  },
  children: [
    new MapboxStyleLayer({
      name: 'ch.sbb.zweitausbildung.haltestellen.aufbau',
      isQueryable: false,
      zIndex: 3,
      mapboxLayer: zweitausbildungStationsDataLayer,
      styleLayersFilter: (styleLayer) =>
        /ch\.sbb\.zweitausbildung_stations\.aufbau/.test(styleLayer.id),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungSubLayerInfo',
        zweitausbildung: {
          infos: {
            title: 'ch.sbb.zweitausbildung.haltestellen.aufbau-title',
            legend: [
              {
                image: 'station_aufbau.png',
                name: 'ch.sbb.zweitausbildung.haltestellen-stations',
              },
              {
                image: 'station_aufbau_grenzstation.png',
                name: 'ch.sbb.zweitausbildung.haltestellen-border-stations',
              },
            ],
          },
        },
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.zweitausbildung.haltestellen.basis',
      isQueryable: false,
      zIndex: 3,
      mapboxLayer: zweitausbildungStationsDataLayer,
      styleLayersFilter: (styleLayer) =>
        /ch\.sbb\.zweitausbildung_stations\.basis/.test(styleLayer.id),
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungSubLayerInfo',
        zweitausbildung: {
          infos: {
            title: 'ch.sbb.zweitausbildung.haltestellen.basis-title',
            legend: [
              {
                image: 'station_basis.png',
                name: 'ch.sbb.zweitausbildung.haltestellen-stations',
              },
              {
                image: 'station_basis_grenzstation.png',
                name: 'ch.sbb.zweitausbildung.haltestellen-border-stations',
              },
            ],
          },
        },
      },
    }),
  ],
});

export const zweitausbildungPoisDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.zweitausbildung_pois',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'ch.sbb.zweitausbildung_pois',
  properties: {
    hideInLegend: true,
  },
});
export const zweitausbildungPois = new Layer({
  name: 'ch.sbb.zweitausbildung.tourist.pois.group',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'ZweitausbildungLayerInfo',
    zweitausbildung: {
      infos: {
        title: 'ch.sbb.zweitausbildung.tourist.pois.group-title',
      },
    },
  },
  children: [
    new ZweitausbildungPoisLayer({
      name: 'ch.sbb.zweitausbildung.tourist.pois.no_railaway',
      key: 'ch.sbb.zweitausbildung.tourist.pois.no_railaway',
      visible: true,
      zIndex: 4,
      mapboxLayer: zweitausbildungPoisDataLayer,
      properties: {
        popupComponent: 'ZweitausbildungPoisPopup',
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungSubLayerInfo',
        zweitausbildung: {
          filter: ['==', 'rail_away', false],
          color: 'rgba(0, 61, 133, 0.8)',
          icon: 'flag_blue',
          infos: {
            legend: [
              {
                image: 'poi_no_railaway.png',
                name: 'ch.sbb.zweitausbildung.tourist.pois.no_railaway-name',
              },
            ],
          },
        },
      },
    }),
    new ZweitausbildungPoisLayer({
      name: 'ch.sbb.zweitausbildung.tourist.pois.railaway',
      key: 'ch.sbb.zweitausbildung.tourist.pois.railaway',
      visible: true,
      zIndex: 4,
      mapboxLayer: zweitausbildungPoisDataLayer,
      properties: {
        popupComponent: 'ZweitausbildungPoisPopup',
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungSubLayerInfo',
        zweitausbildung: {
          filter: ['==', 'rail_away', true],
          color: 'rgba(235, 0, 0, 0.8)',
          icon: 'flag_red',
          infos: {
            legend: [
              {
                image: 'poi_railaway.png',
                name: 'ch.sbb.zweitausbildung.tourist.pois.railaway-name',
              },
            ],
          },
        },
      },
    }),
  ],
});

export const zweitausbildungRoutes = new Layer({
  name: 'ch.sbb.zweitausbildung.linien.group',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'ZweitausbildungLayerInfo',
    zweitausbildung: {
      infos: {
        title: 'ch.sbb.zweitausbildung.linien.group-title',
      },
    },
  },
  children: [
    new ZweitausbildungRoutesLayer({
      name: 'ch.sbb.zweitausbildung.tourist.routes.group',
      key: 'ch.sbb.zweitausbildung.tourist.routes.group',
      isAlwaysExpanded: true,
      visible: false,
      mapboxLayer: dataLayer,
      isQueryable: false,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungRoutesSubLayerInfo',
        radioGroup: 'zweitausbildungRoutes',
        zweitausbildung: {
          property: 'touristische_linie',
          infos: {
            title: 'ch.sbb.zweitausbildung.tourist.routes.group',
            desc: 'ch.sbb.zweitausbildung.tourist.routes.group-desc',
            legend: {
              image: 'legend_tourist_strecken.png',
            },
          },
          layer: 'zweitausbildung_tourist_strecken_grouped_qry',
        },
      },
      children: [
        new ZweitausbildungRoutesHighlightLayer({
          name: 'ch.sbb.zweitausbildung.tourist.routes.grouped',
          visible: false,
          zIndex: 1,
          mapboxLayer: dataLayer,
          properties: {
            popupComponent: 'ZweitausbildungRoutesPopup',
            zweitausbildung: {
              property: 'touristische_linie',
              layer: 'zweitausbildung_tourist_strecken',
              featureInfoLayer: 'zweitausbildung_tourist_strecken_qry_xyr',
            },
          },
        }),
      ],
    }),
    new ZweitausbildungRoutesLayer({
      name: 'ch.sbb.zweitausbildung.hauptlinien.group',
      visible: true,
      isQueryable: false,
      isAlwaysExpanded: true,
      mapboxLayer: dataLayer,
      properties: {
        hasInfos: true,
        layerInfoComponent: 'ZweitausbildungRoutesSubLayerInfo',
        zweitausbildung: {
          property: 'hauptlinie',
          infos: {
            title: 'ch.sbb.zweitausbildung.hauptlinien.group',
            desc: 'ch.sbb.zweitausbildung.hauptlinien.group-desc',
            legend: {
              image: 'legend_hauptlinien.png',
            },
          },
          layer: 'zweitausbildung_hauptlinien_grouped_qry',
        },
        radioGroup: 'zweitausbildungRoutes',
      },
      children: [
        new ZweitausbildungRoutesHighlightLayer({
          name: 'ch.sbb.zweitausbildung.hauptlinien.grouped',
          visible: true,
          zIndex: 1,
          mapboxLayer: dataLayer,
          properties: {
            popupComponent: 'ZweitausbildungRoutesPopup',
            zweitausbildung: {
              property: 'hauptlinie',
              layer: 'zweitausbildung_hauptlinien',
              featureInfoLayer: 'zweitausbildung_hauptlinien_qry_xyr',
            },
          },
        }),
      ],
    }),
  ],
});

export const tarifverbundkarteLayer = new TarifverbundkarteLayer({
  mapboxLayer: tarifverbundkarteDataLayer,
  visible: true,
  properties: {
    hideInLegend: true,
    popupComponent: 'TarifverbundkartePopup',
  },
});

export const anlagenverantwortliche = new TrafimageMapboxLayer({
  name: 'ch.sbb.anlagenverantwortliche',
  style: 'netzkarte_eisenbahninfrastruktur_v3_ch.sbb.anlagenverantwortliche',
  isBaseLayer: false,
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  properties: {
    hideInLegend: true,
  },
});

export const regionenkartePublicSegment = new Layer({
  name: 'ch.sbb.regionenkarte.intern.av_segmente.public',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'RegionenkartePublicLayerInfo',
  },
  children: [
    new MapboxStyleLayer({
      name: 'ch.sbb.regionenkarte.lines',
      isQueryable: true,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /anlagenverantwortliche\.lines$/.test(id);
      },
      featureInfoFilter: (feature) => {
        // There is some points in this data source and we don't want them.
        return (
          feature.getGeometry().getType() === GeometryType.LINE_STRING ||
          feature.getGeometry().getType() === GeometryType.MULTI_LINE_STRING
        );
      },
      properties: {
        hideInLegend: true,
        useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
        popupComponent: 'RegionenkarteSegmentPopup',
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.regionenkarte.stations',
      isQueryable: false,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /anlagenverantwortliche\.stations/.test(id);
      },
      properties: {
        hideInLegend: true,
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.regionenkarte.regionintersection',
      isQueryable: true,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /anlagenverantwortliche\.regionintersection/.test(id);
      },
      properties: {
        hideInLegend: true,
        showPopupOnHover: true,
        popupComponent: 'RegionenkarteIntersectionPopup',
      },
    }),
  ],
});

export const regionenkarteOverlayGroup = new Layer({
  name: 'ch.sbb.infrastruktur.overlay.group',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.infrastruktur.overlay.group-desc',
  },
  children: [
    new MapboxStyleLayer({
      name: 'ch.sbb.infrastruktur.betriebspunkte',
      visible: true,
      isQueryable: false,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        // We select all stations
        return /FanasStation/.test(id);
      },
      properties: {
        hasInfos: true,
        description: 'ch.sbb.infrastruktur.betriebspunkte-desc',
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.infrastruktur.line_point',
      visible: true,
      isQueryable: false,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /FanasLine|DFA/.test(id);
      },
      properties: {
        hasInfos: true,
        description: 'ch.sbb.infrastruktur.line_point-desc',
      },
    }),
  ],
});

export const netzentwicklungDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.data',
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'netzkarte_eisenbahninfrastruktur_v3_ch.sbb.netzentwicklung',
  properties: {
    hideInLegend: true,
  },
});

export const netzentwicklungProgrammManagerLayer = new MapboxStyleLayer({
  name: 'ch.sbb.netzentwicklung.programm_manager',
  mapboxLayer: netzentwicklungDataLayer,
  visible: false,
  queryRenderedLayersFilter: ({ id }) => /programm_manager$/.test(id),
  styleLayersFilter: ({ id }) => /programm_manager$/.test(id),
  properties: {
    radioGroup: 'netzentwicklung',
    popupComponent: 'NetzentwicklungPopup',
    netzentwicklungRoleType: 'Programm Manager', // display only roles of this type
    hasInfos: true,
    useOverlay: true,
    layerInfoComponent: 'NetzentwicklungLayerInfo',
  },
});

export const netzentwicklungSkPlanerLayer = new MapboxStyleLayer({
  name: 'ch.sbb.netzentwicklung.sk_planer',
  mapboxLayer: netzentwicklungDataLayer,
  visible: true,
  queryRenderedLayersFilter: ({ id }) => /sk_planer$/.test(id),
  styleLayersFilter: ({ id }) => /sk_planer$/.test(id),
  properties: {
    radioGroup: 'netzentwicklung',
    popupComponent: 'NetzentwicklungPopup',
    netzentwicklungRoleType: 'S&K Planer', // display only roles of this type
    hasInfos: true,
    useOverlay: true,
    layerInfoComponent: 'NetzentwicklungLayerInfo',
  },
});

export const netzentwicklungStrategischLayer = new MapboxStyleLayer({
  name: 'ch.sbb.netzentwicklung.strategisch',
  mapboxLayer: netzentwicklungDataLayer,
  visible: false,
  queryRenderedLayersFilter: ({ id }) => /strategisch$/.test(id),
  styleLayersFilter: ({ id }) => /strategisch$/.test(id),
  properties: {
    radioGroup: 'netzentwicklung',
    popupComponent: 'NetzentwicklungPopup',
    netzentwicklungRoleType: 'Netzentwickler Strategisch', // display only roles of this type
    hasInfos: true,
    useOverlay: true,
    layerInfoComponent: 'NetzentwicklungLayerInfo',
  },
});

export default [
  dataLayer,
  netzkarteLayer,
  netzkarteNight,
  swisstopoSwissImage,
  swisstopoLandeskarte,
  swisstopoLandeskarteGrau,
];
