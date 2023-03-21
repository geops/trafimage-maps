import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import DirektverbindungenLayer from '../../layers/DirektverbindungenLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import { IPV_KEY } from '../../utils/constants';
import netzkarteNightImg from '../../img/netzkarte_night.png';
import netzkarte from '../../img/netzkarte.png';
import luftbild from '../../img/luftbild.png';

export const dataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.ipv.data',
  visible: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_direktverbindungen',
  properties: {
    hideInLegend: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const ipvBaseDay = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.layer',
  key: 'ch.sbb.netzkarte',
  group: 'baseLayer',
  properties: {
    previewImage: netzkarte,
    isBaseLayer: true,
  },
  visible: true,
  mapboxLayer: dataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'perimeter_mask',
  style: 'base_bright_v2_direktverbindungen',
});

export const ipvBaseNight = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.dark',
  key: 'ch.sbb.netzkarte.dark',
  group: 'baseLayer',
  properties: {
    previewImage: netzkarteNightImg,
    isBaseLayer: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'base_dark_v2_direktverbindungen',
});

export const ipvBaseAerial = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.luftbild.group',
  key: 'ch.sbb.netzkarte.luftbild.group',
  group: 'baseLayer',
  properties: {
    previewImage: luftbild,
    isBaseLayer: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'aerial_sbb_direktverbindungen_preview',
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

export default [
  dataLayer,
  ipvBaseDay,
  ipvBaseNight,
  ipvBaseAerial,
  ipvDay,
  ipvNight,
];
