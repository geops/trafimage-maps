import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import RailplusLayer from '../../layers/RailplusLayer';
import { FORCE_EXPORT_PROPERTY } from '../../utils/constants';

export const netzkarteRailplus = new TrafimageMapboxLayer({
  name: 'ch.railplus.mitglieder.data',
  visible: true,
  zIndex: -1,
  style: 'base_bright_v2_ch.railplus.meterspurbahnen',
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
    useOverlay: true,
  },
});

export const railplusMeterspurbahnenPrint = new RailplusLayer({
  name: 'ch.railplus.mitglieder.meterspur.print',
  visible: false,
  mapboxLayer: netzkarteRailplus,
  styleLayersFilter: ({ metadata }) =>
    metadata &&
    metadata['railplus.filter'] &&
    /^(print|logos)$/.test(metadata['railplus.filter']),
  properties: {
    [FORCE_EXPORT_PROPERTY]: true,
  },
});

export default [
  netzkarteRailplus,
  railplusMeterspurbahnen,
  railplusMeterspurbahnenPrint,
];
