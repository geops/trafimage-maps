import { Layer } from 'mobility-toolbox-js/ol';
// import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
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
  visible: false,
  properties: {
    isQueryable: true,
    routeType: 'day',
    hasInfos: true,
    layerInfoComponent: 'DirektVerbindungenTagLayerInfo',
    popupComponent: 'DirektverbindungPopup',
    useOverlay: true,
    priorityFeatureInfo: true, // This property will block display of others featureInfos
  },
});

export const ipvNight = new DirektverbindungenLayer({
  name: `${IPV_KEY}.night`,
  mapboxLayer: dataLayer,
  visible: false,
  properties: {
    isQueryable: true,
    routeType: 'night',
    hasInfos: true,
    layerInfoComponent: 'DirektVerbindungenNachtLayerInfo',
    popupComponent: 'DirektverbindungPopup',
    useOverlay: true,
    priorityFeatureInfo: true, // This property will block display of others featureInfos
  },
});

export const ipvLayer = new Layer({
  name: IPV_KEY,
  children: [ipvDay, ipvNight],
  isQueryable: false,
  visible: true,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'DirektVerbindungenLayerInfo',
    dataLink:
      'https://data.sbb.ch/explore/dataset/direktverbindungen/information/',
    hideInLegend: true,
  },
});
export default [dataLayer, ipvLayer];
