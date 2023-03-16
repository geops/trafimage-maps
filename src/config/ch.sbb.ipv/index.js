import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import DirektverbindungenLayer from '../../layers/DirektverbindungenLayer';
import { IPV_KEY } from '../../utils/constants';

export const dataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.ipv.data',
  visible: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_ch.sbb.netzkarte',
  properties: {
    hideInLegend: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const ipvDay = new DirektverbindungenLayer({
  name: `${IPV_KEY}.day`,
  mapboxLayer: dataLayer,
  visible: true,
  properties: {
    isQueryable: true,
    routeType: 'day',
    hasInfos: true,
    layerInfoComponent: 'IpvTagLayerInfo',
    popupComponent: 'IpvPopup',
    useOverlay: true,
    priorityFeatureInfo: true, // This property will block display of others featureInfos
  },
});

export const ipvNight = new DirektverbindungenLayer({
  name: `${IPV_KEY}.night`,
  mapboxLayer: dataLayer,
  visible: true,
  properties: {
    isQueryable: true,
    routeType: 'night',
    hasInfos: true,
    layerInfoComponent: 'IpvNachtLayerInfo',
    popupComponent: 'IpvPopup',
    useOverlay: true,
    priorityFeatureInfo: true, // This property will block display of others featureInfos
  },
});

export default [dataLayer, ipvDay, ipvNight];
