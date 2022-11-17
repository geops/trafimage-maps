import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Layer } from 'mobility-toolbox-js/ol';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import HighlightRoutesLayer from '../../layers/StsHighlightRoutesLayer';
import featureStyler from './FeatureStyler';

// const { POIS_URL } = process.env;
const FILTER_KEY = 'sts.filter';
const FILTER_GTTOS_VALUE = 'sts_gttos';
const FILTER_PREMIUM_VALUE = 'sts_premium';
const FILTER_HIGHLIGHT_VALUE = 'sts_highlight';
const FILTER_OTHERS_VALUE = 'sts_others';

// We support hash for backward compatibility
// const hash = window.location.hash.replace('#/?', '');
// const params = qs.parse(hash || window.location.search);
// const { layers } = params;

const stsDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.sts.iframe.data',
  visible: true,
  preserveDrawingBuffer: false,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_sts',
  properties: {
    isQueryable: false,
    isBaseLayer: true,
    hideInLegend: true,
  },
});

const highlights = new Layer({
  name: 'Highlights',
  key: 'ch.sbb.sts.sts.highlights',
  visible: false,
  olLayer: new VectorLayer({
    minZoom: 8.5,
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    style: (feature) => featureStyler.poisStyleFunction(feature),
  }),
  properties: {
    isQueryable: true,
  },
});

// fetch(POIS_URL || 'static/data/pois.geojson')
//   .then((response) => response.json())
//   .then((data) => {
//     const features = new GeoJSON().readFeatures(data, {
//       dataProjection: 'EPSG:4326',
//       featureProjection: 'EPSG:3857',
//     });
//     highlights.olLayer.getSource().addFeatures(features);
//   });

export const highlightRoutes = new HighlightRoutesLayer({
  name: 'Highlight routes',
  mapboxLayer: stsDataLayer,
  visible: false,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_HIGHLIGHT_VALUE,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_HIGHLIGHT_VALUE,
  properties: {
    isQueryable: true,
  },
});

export const othersRoutes = new MapboxStyleLayer({
  name: 'Other routes',
  mapboxLayer: stsDataLayer,
  visible: true,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_OTHERS_VALUE,
});

export const gttos = new MapboxStyleLayer({
  name: 'Grand Train Tour of Switzerland',
  key: 'ch.sbb.sts.sts.gttos',
  mapboxLayer: stsDataLayer,
  visible: false,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_GTTOS_VALUE,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_GTTOS_VALUE,
  group: 'ch.sbb.sts.sts.group',
  properties: {
    isQueryable: true,
  },
});

export const premium = new MapboxStyleLayer({
  name: 'Premium Panoramic Trains',
  key: 'ch.sbb.sts.sts.premium',
  mapboxLayer: stsDataLayer,
  visible: true,
  group: 'ch.sbb.sts.sts.group',
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_PREMIUM_VALUE,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_PREMIUM_VALUE,
  properties: {
    isQueryable: true,
  },
});

export default [
  stsDataLayer,
  //   othersRoutes,
  highlightRoutes,
  premium,
  gttos,
  highlights,
];
