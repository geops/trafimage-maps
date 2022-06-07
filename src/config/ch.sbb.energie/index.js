import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';

export const energieDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.energie.public.data',
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  style: 'netzkarte_eisenbahninfrastruktur_v3_ch.sbb.energie.public',
  properties: {
    hideInLegend: true,
  },
});

export const energieLeitungenLayer = new MapboxStyleLayer({
  name: 'ch.sbb.energie.public.leitungen',
  mapboxLayer: energieDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && /^leitung$/.test(metadata['energie.filter']),
  styleLayersFilter: ({ metadata }) =>
    metadata &&
    /^(leitung|leitung.label|leitung.label.lc)$/.test(
      metadata['energie.filter'],
    ),
  properties: {
    hasInfos: true,
    layerInfoComponent: 'EnergieLayerInfo',
    popupComponent: 'EnergiePopup',
    useOverlay: true,
  },
});

export const energieUnterwerkeLayer = new MapboxStyleLayer({
  name: 'ch.sbb.energie.public.unterwerke',
  mapboxLayer: energieDataLayer,
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && /^anlagen.uw.icon$/.test(metadata['energie.filter']),
  styleLayersFilter: ({ metadata }) =>
    metadata && /^anlagen.uw$/.test(metadata['energie.filter']),
  properties: {
    hasInfos: true,
    layerInfoComponent: 'EnergieLayerInfo',
    popupComponent: 'EnergiePopup',
    useOverlay: true,
  },
});

export default [
  energieDataLayer,
  energieLeitungenLayer,
  energieUnterwerkeLayer,
];
