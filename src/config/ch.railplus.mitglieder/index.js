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
    metadata['railplus.filter'] &&
    /^line$/.test(metadata['railplus.filter']),
  queryRenderedLayersFilter: ({ metadata }) =>
    metadata &&
    metadata['railplus.filter'] &&
    /^line$/.test(metadata['railplus.filter']),
  properties: {
    isQueryable: true,
    popupComponent: 'RailplusPopup',
  },
});

export default [netzkarteRailplus, railplusMeterspurbahnen];
