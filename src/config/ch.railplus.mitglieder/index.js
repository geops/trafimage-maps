import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import RailplusLayer from '../../layers/RailplusLayer';
import { FORCE_EXPORT_PROPERTY } from '../../utils/constants';

export const MD_RAILPLUS_FILTER = 'railplus.filter';

export const netzkarteRailplus = new TrafimageMapboxLayer({
  name: 'ch.railplus.mitglieder.data',
  visible: true,
  zIndex: -1,
  style: 'base_bright_v2_ch.railplus.meterspurbahnen',
  properties: {
    hideInLegend: true,
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
    /^line$/.test(metadata?.[MD_RAILPLUS_FILTER]),
  properties: {
    isQueryable: true,
    popupComponent: 'RailplusPopup',
    hideInLegend: true,
    useOverlay: true,
  },
});

export const railplusMeterspurbahnenPrint = new RailplusLayer({
  name: 'ch.railplus.mitglieder.meterspur.print',
  visible: false,
  mapboxLayer: netzkarteRailplus,
  styleLayersFilter: ({ metadata }) =>
    /^(print|logos)$/.test(metadata?.[MD_RAILPLUS_FILTER]),
  properties: {
    hideInLegend: true,
    [FORCE_EXPORT_PROPERTY]: true,
  },
});

export const railplusMeterspurbahnenFlags = new RailplusLayer({
  name: 'ch.railplus.mitglieder.meterspur.flags',
  visible: true,
  mapboxLayer: netzkarteRailplus,
  styleLayersFilter: ({ metadata }) => {
    return /^flag$/.test(metadata?.[MD_RAILPLUS_FILTER]);
  },
  properties: {
    hideInLegend: true,
    [FORCE_EXPORT_PROPERTY]: false,
  },
});

export default [
  netzkarteRailplus,
  railplusMeterspurbahnen,
  railplusMeterspurbahnenPrint,
  railplusMeterspurbahnenFlags,
];
