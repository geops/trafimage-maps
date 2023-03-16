import { Layer } from 'mobility-toolbox-js/ol';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
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

export const gemeindegrenzen = new MapboxStyleLayer({
  name: 'ch.sbb.ch_gemeinden',
  mapboxLayer: dataLayer,
  visible: false,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['trafimage.filter'] === 'municipality_borders',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.ch_gemeinden-desc',
  },
});

export const direktverbindungenDay = new DirektverbindungenLayer({
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

export const direktverbindungenNight = new DirektverbindungenLayer({
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

export const direktverbindungenLayer = new Layer({
  name: IPV_KEY,
  children: [direktverbindungenDay, direktverbindungenNight],
  isQueryable: false,
  visible: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'DirektVerbindungenLayerInfo',
    dataLink:
      'https://data.sbb.ch/explore/dataset/direktverbindungen/information/',
  },
});
export default [gemeindegrenzen, direktverbindungenLayer];
