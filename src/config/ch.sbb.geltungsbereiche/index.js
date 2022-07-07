import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import GeltungsbereicheLayer from '../../layers/GeltungsbereicheLayer';

export const geltungsbereicheDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.geltungsbereiche.data',
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
  name: 'ch.sbb.geltungsbereiche-rail',
  mapboxLayer: geltungsbereicheDataLayer,
  styleLayersFilter: ({ id }) => /^geltungsbereiche_/.test(id),
  properties: {
    popupComponent: 'GeltungsbereichePopup',
    useOverlay: true,
  },
});

export default [
  geltungsbereicheDataLayer,
  // geltungsbereicheOther,
  // geltungsbereicheBuslinien,
  // geltungsbereicheBahnlinien,
  geltungsbereicheGA,
];
