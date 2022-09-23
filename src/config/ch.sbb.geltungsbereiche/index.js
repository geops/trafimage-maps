import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import GeltungsbereicheLayer from '../../layers/GeltungsbereicheLayer';

export const geltungsbereicheDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.geltungsbereiche.data',
  visible: true,
  preserveDrawingBuffer: true,
  isQueryable: false,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_ch.sbb.geltungsbereiche',
  properties: {
    hideInLegend: true,
  },
});

export const geltungsbereicheBahnlinien = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche-rail',
  mapboxLayer: geltungsbereicheDataLayer,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter'] === 'rail',
  properties: {
    popupComponent: 'GeltungsbereichePopup',
    useOverlay: true,
    isQueryable: true,
  },
});

export const geltungsbereicheBuslinien = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche-bus',
  mapboxLayer: geltungsbereicheDataLayer,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter'] === 'bus',
  properties: {
    popupComponent: 'GeltungsbereichePopup',
    useOverlay: true,
    isQueryable: true,
  },
});

export const geltungsbereicheOther = new GeltungsbereicheLayer({
  name: 'ch.sbb.geltungsbereiche-other',
  mapboxLayer: geltungsbereicheDataLayer,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['geltungsbereiche.filter'] === 'other',
  properties: {
    popupComponent: 'GeltungsbereichePopup',
    useOverlay: true,
    isQueryable: true,
  },
});

export default [
  geltungsbereicheDataLayer,
  geltungsbereicheOther,
  geltungsbereicheBuslinien,
  geltungsbereicheBahnlinien,
];
