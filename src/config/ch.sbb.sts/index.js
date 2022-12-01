import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import { VectorLayer as MTVectorLayer } from 'mobility-toolbox-js/ol';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import HighlightRoutesLayer from '../../layers/StsHighlightRoutesLayer';
import DirektverbindungenLayer from '../../layers/DirektverbindungenLayer';
import { DIREKTVERBINDUNGEN_KEY } from '../../utils/constants';
import poiImage from './img/poi.png';
import poiImageHL from './img/poi_hl.png';

// const { POIS_URL } = process.env;
const FILTER_KEY = 'sts.filter';
const FILTER_GTTOS_VALUE = 'sts_gttos';
const FILTER_PREMIUM_VALUE = 'sts_premium';
const FILTER_HIGHLIGHT_VALUE = 'sts_highlight';
const FILTER_OTHERS_VALUE = 'sts_others';
const FILTER_LINE_VALUE = 'sts.line'; // style using nova daten

const DATA_LAYER_KEY = 'ch.sbb.sts.data';
const HIGHLIGHTS_LAYER_KEY = 'ch.sbb.sts.validity.highlights';
const ROUTES_HIGHLIGHT_LAYER_KEY = 'ch.sbb.sts.validity.routes_highlight';
const OTHER_LAYER_KEY = 'ch.sbb.sts.validity.other';
const GTTOS_LAYER_KEY = 'ch.sbb.sts.validity.gttos';
const PREMIUM_LAYER_KEY = 'ch.sbb.sts.validity.premium';
const DIREKTVERBINDUNGEN_DAY_LAYER_KEY = `${DIREKTVERBINDUNGEN_KEY}.day`;
const DIREKTVERBINDUNGEN_NIGHT_LAYER_KEY = `${DIREKTVERBINDUNGEN_KEY}.night`;

const stsDataLayer = new TrafimageMapboxLayer({
  name: DATA_LAYER_KEY,
  key: DATA_LAYER_KEY,
  visible: true,
  preserveDrawingBuffer: false,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_ch.sbb.geltungsbereiche_ga',
  hitTolerance: 15,
  properties: {
    isQueryable: false,
    isBaseLayer: true,
    hideInLegend: true,
  },
});

export const highlights = new MTVectorLayer({
  name: 'Highlights',
  key: HIGHLIGHTS_LAYER_KEY,
  visible: true,
  olLayer: new VectorLayer({
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    style: (feature) => {
      if (!feature.get('highlight_url')) {
        return null;
      }
      return feature.get('selected')
        ? [
            new Style({
              image: new Icon({
                src: poiImageHL,
                anchor: [0.5, 41],
                anchorYUnits: 'pixels',
              }),
            }),
          ]
        : [
            new Style({
              image: new Icon({
                src: poiImage,
                anchor: [0.5, 41],
                anchorYUnits: 'pixels',
              }),
            }),
          ];
    },
  }),
  properties: {
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
  },
});

fetch('data/pois.geojson')
  .then((response) => response.json())
  .then((data) => {
    const features = new GeoJSON().readFeatures(data, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    highlights.olLayer.getSource().addFeatures(features);
  });

export const highlightRoutes = new HighlightRoutesLayer({
  name: 'Highlight routes',
  key: ROUTES_HIGHLIGHT_LAYER_KEY,
  mapboxLayer: stsDataLayer,
  visible: true,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_HIGHLIGHT_VALUE,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_HIGHLIGHT_VALUE,
  properties: {
    isQueryable: false,
    disableSetFeatureInfoOnHover: true,
  },
});

// Hide the routes displayed by default like gqa ones
const hiddenRoutes = new MapboxStyleLayer({
  name: 'Hidden routes',
  mapboxLayer: stsDataLayer,
  visible: false,
  styleLayersFilter: ({ metadata, id }) =>
    /^gb_Fanas_Bus/.test(id) ||
    !!(
      metadata &&
      metadata['geltungsbereiche.filter'] &&
      /(hta|ga|tk)\.line/.test(metadata['geltungsbereiche.filter'] || '')
    ),
  properties: {
    isQueryable: true,
  },
});

export const otherRoutes = new MapboxStyleLayer({
  name: 'Other routes',
  key: OTHER_LAYER_KEY,
  mapboxLayer: stsDataLayer,
  visible: true,
  queryRenderedLayersFilter: ({ metadata }) => {
    return (
      metadata &&
      (metadata[FILTER_KEY] === FILTER_OTHERS_VALUE ||
        (metadata['geltungsbereiche.filter'] &&
          metadata['geltungsbereiche.filter'].includes(FILTER_LINE_VALUE)))
    );
  },
  styleLayersFilter: ({ metadata }) => {
    return (
      metadata &&
      (metadata[FILTER_KEY] === FILTER_OTHERS_VALUE ||
        (metadata['geltungsbereiche.filter'] &&
          metadata['geltungsbereiche.filter'].includes(FILTER_LINE_VALUE)))
    );
  },
  properties: {
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
    validPropertyName: 'valid_sts',
    getTextFromValid: (valid) => {
      if (valid === 50) {
        return '50% Ermässigung';
      }
      if (valid === 25) {
        return '25% Ermässigung';
      }
      if (valid === -1) {
        return 'Gültigkeit vor Ort erfragen';
      }
      return 'Freie Fahrt';
    },
    products: [
      'ch.sbb.geltungsbereiche.products.sts',
      'ch.sbb.geltungsbereiche.products.sts-half',
    ],
  },
});

export const gttos = new MapboxStyleLayer({
  name: 'Grand Train Tour of Switzerland',
  key: GTTOS_LAYER_KEY,
  mapboxLayer: stsDataLayer,
  visible: true,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_GTTOS_VALUE,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_GTTOS_VALUE,
  group: 'ch.sbb.sts.validity.group',
  properties: {
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
  },
});

export const premium = new MapboxStyleLayer({
  name: 'Premium Panoramic Trains',
  key: PREMIUM_LAYER_KEY,
  mapboxLayer: stsDataLayer,
  visible: false,
  group: 'ch.sbb.sts.validity.group',
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_PREMIUM_VALUE,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_PREMIUM_VALUE,
  properties: {
    disableSetFeatureInfoOnHover: true,
    isQueryable: true,
  },
});

export const direktverbindungenNight = new DirektverbindungenLayer({
  name: DIREKTVERBINDUNGEN_NIGHT_LAYER_KEY,
  key: DIREKTVERBINDUNGEN_NIGHT_LAYER_KEY,
  mapboxLayer: stsDataLayer,
  visible: false,
  properties: {
    routeType: 'night',
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
    useDvPoints: false,
  },
});

export const direktverbindungenDay = new DirektverbindungenLayer({
  name: DIREKTVERBINDUNGEN_DAY_LAYER_KEY,
  key: DIREKTVERBINDUNGEN_DAY_LAYER_KEY,
  mapboxLayer: stsDataLayer,
  visible: false,
  properties: {
    routeType: 'day',
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
    useDvPoints: false,
  },
});

export default [
  stsDataLayer,
  hiddenRoutes,
  otherRoutes,
  highlightRoutes,
  premium,
  gttos,
  highlights,
  direktverbindungenDay,
  direktverbindungenNight,
];
