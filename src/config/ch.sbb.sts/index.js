import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import HighlightRoutesLayer from '../../layers/StsHighlightRoutesLayer';
import DirektverbindungenLayer from '../../layers/DirektverbindungenLayer';
import { DIREKTVERBINDUNGEN_KEY, SWISS_EXTENT } from '../../utils/constants';
import StsPoisLayer from '../../layers/StsPoisLayer';

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

export const highlights = new StsPoisLayer({
  name: 'Highlights',
  key: HIGHLIGHTS_LAYER_KEY,
  visible: false,
  properties: {
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
    maxExtent: SWISS_EXTENT,
    minZoom: 8,
  },
});

export const highlightRoutes = new HighlightRoutesLayer({
  name: 'Highlight routes',
  key: ROUTES_HIGHLIGHT_LAYER_KEY,
  mapboxLayer: stsDataLayer,
  visible: true,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_HIGHLIGHT_VALUE,
  properties: {
    isQueryable: false,
    disableSetFeatureInfoOnHover: true,
    maxExtent: SWISS_EXTENT,
    minZoom: 8,
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
    minZoom: 8,
  },
});

export const otherRoutes = new MapboxStyleLayer({
  name: 'Other routes',
  key: OTHER_LAYER_KEY,
  mapboxLayer: stsDataLayer,
  visible: true,
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
    maxExtent: SWISS_EXTENT,
    minZoom: 8,
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
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_GTTOS_VALUE,
  group: 'ch.sbb.sts.validity.group',
  properties: {
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
    maxExtent: SWISS_EXTENT,
    minZoom: 8,
  },
});

export const premium = new MapboxStyleLayer({
  name: 'Premium Panoramic Trains',
  key: PREMIUM_LAYER_KEY,
  mapboxLayer: stsDataLayer,
  visible: false,
  group: 'ch.sbb.sts.validity.group',
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_PREMIUM_VALUE,
  properties: {
    disableSetFeatureInfoOnHover: true,
    isQueryable: true,
    maxExtent: SWISS_EXTENT,
    minZoom: 8,
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