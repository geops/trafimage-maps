import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import GeltungsbereicheLayer from '../../layers/GeltungsbereicheLayer';

export const geltungsbereicheDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.geltungsbereiche.mvp.data',
  visible: true,
  preserveDrawingBuffer: true,
  isQueryable: false,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_ch.sbb.geltungsbereiche_ga',
  properties: {
    hideInLegend: true,
    isBaseLayer: true,
  },
});

export const geltungsbereicheGA = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche.mvp-ga_s25',
  mapboxLayer: geltungsbereicheDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('ga.line'),
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('ga.line'),
  group: 'ch.sbb.geltungsbereiche.group',
  properties: {
    isQueryable: true,
    hasInfos: true,
    layerInfoComponent: 'GeltungsbereicheLayerInfo',
    useOverlay: true,
    popupComponent: 'GeltungsbereicheGaPopup',
    validPropertyName: 'valid_ga',
    cardsScope: 'ga',
    products: [
      'ch.sbb.geltungsbereiche.products.ga',
      'ch.sbb.geltungsbereiche.products.ga-night',
      'ch.sbb.geltungsbereiche.products.ga-month',
      'ch.sbb.geltungsbereiche.products.excursion',
      'ch.sbb.geltungsbereiche.products.hta-day',
      'ch.sbb.geltungsbereiche.products.hta-combi',
    ],
  },
});

export const geltungsbereicheTk = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche.mvp-tk',
  visible: false,
  mapboxLayer: geltungsbereicheDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('tk.line'),
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('tk.line'),
  group: 'ch.sbb.geltungsbereiche.group',
  properties: {
    isQueryable: true,
    popupComponent: 'GeltungsbereicheGaPopup',
    useOverlay: true,
    validPropertyName: 'valid_ga',
    cardsScope: 'tk',
    hasInfos: true,
    layerInfoComponent: 'GeltungsbereicheLayerInfo',
    products: [
      'ch.sbb.geltungsbereiche.products.saver',
      'ch.sbb.geltungsbereiche.products.promo',
      'ch.sbb.geltungsbereiche.products.municipal-day',
    ],
    productsRemark: 'ch.sbb.geltungsbereiche.products.tk-no-hta',
  },
});

export const geltungsbereicheHta = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche.mvp-hta',
  visible: false,
  mapboxLayer: geltungsbereicheDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('hta.line'),
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('hta.line'),
  group: 'ch.sbb.geltungsbereiche.group',
  properties: {
    isQueryable: true,
    popupComponent: 'GeltungsbereicheGaPopup',
    useOverlay: true,
    validPropertyName: 'valid_hta',
    cardsScope: 'hta',
    hasInfos: true,
    layerInfoComponent: 'GeltungsbereicheLayerInfo',
    getTextFromValid: (valid) => {
      if (valid === -1) {
        return 'Gültigkeit vor Ort erfragen';
      }
      return 'Fahrt zum ermässigten Preis';
    },
    products: ['ch.sbb.geltungsbereiche.products.hta'],
  },
});

export const geltungsbereicheSTS = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche.mvp-sts',
  visible: false,
  mapboxLayer: geltungsbereicheDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('sts.line'),
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('sts.line'),
  group: 'ch.sbb.geltungsbereiche.group',
  properties: {
    isQueryable: true,
    popupComponent: 'GeltungsbereicheGaPopup',
    useOverlay: true,
    validPropertyName: 'valid_sts',
    cardsScope: 'sts',
    hasInfos: true,
    layerInfoComponent: 'GeltungsbereicheLayerInfo',
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

export default [
  geltungsbereicheDataLayer,
  geltungsbereicheSTS,
  geltungsbereicheTk,
  geltungsbereicheHta,
  geltungsbereicheGA,
];
