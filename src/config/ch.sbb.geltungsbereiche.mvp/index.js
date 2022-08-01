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
  name: 'ch.sbb.geltungsbereiche.mvp-ga_hta_s25',
  mapboxLayer: geltungsbereicheDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata &&
    metadata['geltungsbereiche.filter'] &&
    /.*(?<!\.select)$/.test(metadata['geltungsbereiche.filter']),
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter'] === 'ga.line',
  properties: {
    radioGroup: 'ch.sbb.geltungsbereiche.group',
    hasInfos: false,
    useOverlay: true,
    popupComponent: 'GeltungsbereicheGaPopup',
  },
});

// export const geltungsbereicheSTS = new GeltungsbereicheLayer({
//   name: 'ch.sbb.geltungsbereiche.mvp-sts',
//   visible: false,
//   mapboxLayer: geltungsbereicheDataLayer,
//   queryRenderedLayersFilter: ({ metadata }) =>
//     metadata &&
//     metadata['geltungsbereiche.filter'] &&
//     /.*(?<!\.select)$/.test(metadata['geltungsbereiche.filter']),
//   properties: {
//     popupComponent: 'GeltungsbereicheGaPopup',
//     useOverlay: true,
//     radioGroup: 'ch.sbb.geltungsbereiche.group',
//   },
// });

export default [
  geltungsbereicheDataLayer,
  // geltungsbereicheSTS,
  geltungsbereicheGA,
];
