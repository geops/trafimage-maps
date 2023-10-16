import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';

export const netzkarteRailplus = new TrafimageMapboxLayer({
  name: 'ch.railplus.meterspurbahnen.data',
  visible: true,
  zIndex: -1,
  style: 'netzkarte_eisenbahninfrastruktur_v3_ch.railplus',
  properties: {
    isBaseLayer: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const railplusTVS = new MapboxStyleLayer({
  name: 'ch.railplus.meterspurbahnen',
  visible: true,
  mapboxLayer: netzkarteRailplus,
  styleLayersFilter: ({ metadata }) =>
    metadata &&
    metadata['isb.filter'] &&
    /^(tvs|tvs_flag)$/.test(metadata['isb.filter']),
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata && metadata['isb.filter'] && /^tvs$/.test(metadata['isb.filter']),
  properties: {
    isQueryable: true,
    popupComponent: 'RailplusMeterspurPopup',
  },
});

export default [netzkarteRailplus, railplusTVS];
