import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { VectorLayer as MTVectorLayer } from 'mobility-toolbox-js/ol';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import HighlightRoutesLayer from '../../layers/StsHighlightRoutesLayer';
import DirektverbindungenLayer from '../../layers/DirektverbindungenLayer';
import featureStyler from './FeatureStyler';

// const { POIS_URL } = process.env;
const FILTER_KEY = 'sts.filter';
const FILTER_GTTOS_VALUE = 'sts_gttos';
const FILTER_PREMIUM_VALUE = 'sts_premium';
const FILTER_HIGHLIGHT_VALUE = 'sts_highlight';
const FILTER_OTHERS_VALUE = 'sts_others';
const FILTER_LINE_VALUE = 'sts.line'; // style using nova daten

const DATA_LAYER_KEY = 'ch.sbb.sts.iframe.data';
const HIGHLIGHTS_LAYER_KEY = 'ch.sbb.sts.validity.highlights';
const ROUTES_HIGHLIGHT_LAYER_KEY = 'ch.sbb.sts.validity.routes_highlight';
const OTHER_LAYER_KEY = 'ch.sbb.sts.validity.other';
const GTTOS_LAYER_KEY = 'ch.sbb.sts.validity.gttos';
const PREMIUM_LAYER_KEY = 'ch.sbb.sts.validity.premium';

const params = new URLSearchParams(window.location.search);
const permalinkLayers = params.get('layers')?.split(',') || [];
const gttosVisible = permalinkLayers.includes(GTTOS_LAYER_KEY);
const premiumVisible =
  !gttosVisible && permalinkLayers.includes(PREMIUM_LAYER_KEY);
const highlightsVisible = permalinkLayers.includes(HIGHLIGHTS_LAYER_KEY);

const stsDataLayer = new TrafimageMapboxLayer({
  name: DATA_LAYER_KEY,
  key: DATA_LAYER_KEY,
  visible: true,
  preserveDrawingBuffer: false,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_ch.sbb.geltungsbereiche_ga',
  properties: {
    isQueryable: false,
    isBaseLayer: true,
    hideInLegend: true,
  },
});

export const highlights = new MTVectorLayer({
  name: 'Highlights',
  key: HIGHLIGHTS_LAYER_KEY,
  visible: highlightsVisible,
  olLayer: new VectorLayer({
    minZoom: 8.5,
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    style: (feature) => featureStyler.poisStyleFunction(feature),
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
  visible: false,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_HIGHLIGHT_VALUE,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_HIGHLIGHT_VALUE,
  properties: {
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
  },
});

// Hide the routes displayed by default like gqa ones
const hiddenRoutes = new MapboxStyleLayer({
  name: 'Hidden routes',
  mapboxLayer: stsDataLayer,
  visible: false,
  styleLayersFilter: ({ metadata }) =>
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
  styleLayersFilter: ({ metadata }) =>
    metadata &&
    (metadata[FILTER_KEY] === FILTER_OTHERS_VALUE ||
      (metadata['geltungsbereiche.filter'] &&
        metadata['geltungsbereiche.filter'].includes(FILTER_LINE_VALUE))),
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
  visible: gttosVisible,
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
  visible: premiumVisible,
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

export const direktverbindungenDay = new DirektverbindungenLayer({
  name: 'Day trains',
  shortName: 'day',
  mapboxLayer: stsDataLayer,
  // visible: permalinkLayers ? /day/.test(permalinkLayers) : false,
  visible: true,
  properties: {
    routeType: 'day',
    isQueryable: true,
    // hasInfos: true,
    // layerInfoComponent: 'DirektVerbindungenNachtLayerInfo',
    // popupComponent: 'DirektverbindungPopup',
    // useOverlay: true,
    // priorityFeatureInfo: true, // This property will block display of others featureInfos
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
];
