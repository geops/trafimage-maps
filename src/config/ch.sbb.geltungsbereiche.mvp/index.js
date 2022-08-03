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
    metadata &&
    metadata['geltungsbereiche.filter'] &&
    /.*(?<!\.select)$/.test(metadata['geltungsbereiche.filter']),
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('ga.line'),
  properties: {
    radioGroup: 'ch.sbb.geltungsbereiche.group',
    hasInfos: false,
    useOverlay: true,
    popupComponent: 'GeltungsbereicheGaPopup',
    validPropertyName: 'valid_ga',
  },
});

export const geltungsbereicheTk = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche.mvp-tk',
  visible: false,
  mapboxLayer: geltungsbereicheDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata &&
    metadata['geltungsbereiche.filter'] &&
    /.*(?<!\.select)$/.test(metadata['geltungsbereiche.filter']),
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('tk.line'),
  properties: {
    popupComponent: 'GeltungsbereicheGaPopup',
    useOverlay: true,
    radioGroup: 'ch.sbb.geltungsbereiche.group',
    validPropertyName: 'valid_ga',
  },
});

export const geltungsbereicheHta = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche.mvp-hta',
  visible: false,
  mapboxLayer: geltungsbereicheDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata &&
    metadata['geltungsbereiche.filter'] &&
    /.*(?<!\.select)$/.test(metadata['geltungsbereiche.filter']),
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('hta.line'),
  properties: {
    popupComponent: 'GeltungsbereicheGaPopup',
    useOverlay: true,
    radioGroup: 'ch.sbb.geltungsbereiche.group',
    validPropertyName: 'valid_hta',
  },
});

export const geltungsbereicheSTS = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche.mvp-sts',
  visible: false,
  mapboxLayer: geltungsbereicheDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata &&
    metadata['geltungsbereiche.filter'] &&
    /.*(?<!\.select)$/.test(metadata['geltungsbereiche.filter']),
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter']?.includes('sts.line'),
  properties: {
    popupComponent: 'GeltungsbereicheGaPopup',
    useOverlay: true,
    radioGroup: 'ch.sbb.geltungsbereiche.group',
    validPropertyName: 'valid_sts',
  },
});

export default [
  geltungsbereicheDataLayer,
  geltungsbereicheSTS,
  geltungsbereicheHta,
  geltungsbereicheTk,
  geltungsbereicheGA,
];
