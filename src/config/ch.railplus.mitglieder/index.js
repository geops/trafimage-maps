import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import RailplusLayer from '../../layers/RailplusLayer';

export const netzkarteRailplus = new TrafimageMapboxLayer({
  name: 'ch.railplus.mitglieder.data',
  visible: true,
  zIndex: -1,
  style: 'netzkarte_eisenbahninfrastruktur_v3_ch.railplus.meterspurbahnen',
  properties: {
    isBaseLayer: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const railplusMeterspurbahnen = new RailplusLayer({
  name: 'ch.railplus.mitglieder.meterspur',
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
    popupComponent: 'RailplusPopup',
  },
});

export default [netzkarteRailplus, railplusMeterspurbahnen];
