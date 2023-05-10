import { Layer } from 'mobility-toolbox-js/ol';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import DirektverbindungenLayer from '../../layers/DirektverbindungenLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import { DV_HIT_TOLERANCE, DV_KEY } from '../../utils/constants';
import netzkarteNightImg from '../../img/netzkarte_night.png';
import netzkarte from '../../img/netzkarte.png';
import luftbild from '../../img/luftbild.png';

export const dataLayer = new TrafimageMapboxLayer({
  name: `${DV_KEY}.data`,
  visible: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_direktverbindungen',
  hitTolerance: DV_HIT_TOLERANCE,
  properties: {
    hideInLegend: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const dvBaseLight = new MapboxStyleLayer({
  name: `${DV_KEY}.base-light`,
  key: `${DV_KEY}.base-light`,
  group: 'baseLayer',
  properties: {
    previewImage: netzkarte,
    isBaseLayer: true,
  },
  visible: true,
  mapboxLayer: dataLayer,
  style: 'base_bright_v2_direktverbindungen',
});

export const dvBaseDark = new MapboxStyleLayer({
  name: `${DV_KEY}.base-dark`,
  key: `${DV_KEY}.base-dark`,
  group: 'baseLayer',
  properties: {
    previewImage: netzkarteNightImg,
    isBaseLayer: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'base_dark_v2_direktverbindungen_dark',
});

export const dvBaseAerial = new MapboxStyleLayer({
  name: `${DV_KEY}.base-aerial`,
  key: `${DV_KEY}.base-aerial`,
  group: 'baseLayer',
  properties: {
    previewImage: luftbild,
    isBaseLayer: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'aerial_sbb_direktverbindungen_dark',
});

export const dvDay = new Layer({
  name: `${DV_KEY}.day`,
  key: `${DV_KEY}.day`,
  mapboxLayer: dataLayer,
  visible: true,
  properties: {
    routeType: 'day',
    color: 'rgb(247, 181, 0)',
    hasInfos: true,
    layerInfoComponent: 'DvLayerInfo',
    dataLink:
      'https://data.sbb.ch/explore/dataset/direktverbindungen/information/',
  },
});

export const dvNight = new Layer({
  name: `${DV_KEY}.night`,
  key: `${DV_KEY}.night`,
  mapboxLayer: dataLayer,
  visible: true,
  properties: {
    routeType: 'night',
    color: 'rgb(0, 110, 179)',
    hasInfos: true,
    layerInfoComponent: 'DvLayerInfo',
    dataLink:
      'https://data.sbb.ch/explore/dataset/direktverbindungen/information/',
  },
});

export const dvMain = new DirektverbindungenLayer({
  visible: true,
  key: `${DV_KEY}.main`,
  mapboxLayer: dataLayer,
  properties: {
    isQueryable: true,
    hideInLegend: true,
    dayLayer: dvDay,
    nightLayer: dvNight,
    popupComponent: 'DvPopup',
    useOverlay: true,
    priorityFeatureInfo: true, // This property will block display of others featureInfos
  },
});

[dvNight, dvDay].forEach((layer) =>
  layer.on('change:visible', (evt) => {
    dvMain.onChangeVisible(evt.target);
  }),
);

export default [
  dataLayer,
  dvBaseLight,
  dvBaseDark,
  dvBaseAerial,
  dvNight,
  dvDay,
  dvMain,
];
