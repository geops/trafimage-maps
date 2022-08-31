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
  },
});

export const geltungsbereicheGA = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche.mvp-ga_s25',
  mapboxLayer: geltungsbereicheDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('ga.line'),
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('ga.line'),
  properties: {
    radioGroup: 'ch.sbb.geltungsbereiche.group',
    hasInfos: true,
    layerInfoComponent: 'GeltungsbereicheLayerInfo',
    useOverlay: true,
    popupComponent: 'GeltungsbereicheGaPopup',
    validPropertyName: 'valid_ga',
    cardsScope: 'ga',
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
  properties: {
    popupComponent: 'GeltungsbereicheGaPopup',
    useOverlay: true,
    radioGroup: 'ch.sbb.geltungsbereiche.group',
    validPropertyName: 'valid_ga',
    cardsScope: 'tk',
    hasInfos: true,
    layerInfoComponent: 'GeltungsbereicheLayerInfo',
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
  properties: {
    popupComponent: 'GeltungsbereicheGaPopup',
    useOverlay: true,
    radioGroup: 'ch.sbb.geltungsbereiche.group',
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
  properties: {
    popupComponent: 'GeltungsbereicheGaPopup',
    useOverlay: true,
    radioGroup: 'ch.sbb.geltungsbereiche.group',
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
  },
});

export default [
  geltungsbereicheDataLayer,
  geltungsbereicheSTS,
  geltungsbereicheHta,
  geltungsbereicheTk,
  geltungsbereicheGA,
];
