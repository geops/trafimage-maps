import { Layer } from 'mobility-toolbox-js/ol';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import netzkarte from '../../img/netzkarte.png';
import netzkarteNightImg from '../../img/netzkarte_night.png';
import landeskarte from '../../img/landeskarte.png';
import landeskarteGrau from '../../img/landeskarte_grau.png';
import luftbild from '../../img/luftbild.png';
import StationsLayer from '../../layers/StationsLayer';
import PlatformsLayer from '../../layers/PlatformsLayer';
import TralisLayer from '../../layers/TralisLayer';
import DirektverbindungenLayer from '../../layers/DirektverbindungenLayer';

export const dataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.data',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'review-geops-tgma-a7je7m.base_bright_v2_ch.sbb.netzkarte',
  properties: {
    hideInLegend: true,
  },
});

export const netzkarteLayer = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.layer',
  key: 'ch.sbb.netzkarte',
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
    previewImage: netzkarte,
  },
  visible: true,
  mapboxLayer: dataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'perimeter_mask',
  style: 'review-geops-tgma-a7je7m.base_bright_v2_ch.sbb.netzkarte',
});

export const netzkarteNight = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.dark',
  key: 'ch.sbb.netzkarte.dark',
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
    previewImage: netzkarteNightImg,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'review-geops-tgma-a7je7m.base_dark_v2_ch.sbb.netzkarte.dark',
});

export const swisstopoSwissImage = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.luftbild.group',
  key: 'ch.sbb.netzkarte.luftbild.group',
  isQueryable: false,
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
    previewImage: luftbild,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style:
    'review-geops-tgma-a7je7m.ch.swisstopo.backgrounds_ch.sbb.netzkarte.swisstopo',
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'swissimage',
});

export const swisstopoLandeskarte = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.landeskarte',
  isQueryable: false,
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
    previewImage: landeskarte,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style:
    'review-geops-tgma-a7je7m.ch.swisstopo.backgrounds_ch.sbb.netzkarte.swisstopo',
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'pixelkarte_farbe',
});

export const swisstopoLandeskarteGrau = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.landeskarte.grau',
  isQueryable: false,
  isBaseLayer: true,
  properties: {
    radioGroup: 'baseLayer',
    previewImage: landeskarteGrau,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style:
    'review-geops-tgma-a7je7m.ch.swisstopo.backgrounds_ch.sbb.netzkarte.swisstopo',
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'pixelkarte_grau',
});

export const passagierfrequenzen = new MapboxStyleLayer({
  name: 'ch.sbb.bahnhoffrequenzen',
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'passagierfrequenzen',
  properties: {
    hasInfos: true,
    layerInfoComponent: 'PassagierFrequenzenLayerInfo',
    popupComponent: 'PassagierFrequenzenPopup',
    useOverlay: true,
  },
});

export const bahnhofplaene = new Layer({
  name: 'ch.sbb.bahnhofplaene',
  visible: false,
  isQueryable: false,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.bahnhofplaene-desc',
  },
});
bahnhofplaene.children = [
  new MapboxStyleLayer({
    name: 'ch.sbb.bahnhofplaene.interaktiv',
    visible: false,
    mapboxLayer: dataLayer,
    styleLayersFilter: ({ metadata }) =>
      !!metadata && metadata['trafimage.filter'] === 'interaktiv',
    properties: {
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.interaktiv-desc',
      popupComponent: 'StationPopup',
      radioGroup: 'bahnhofplaene',
      useOverlay: true,
    },
  }),
  new MapboxStyleLayer({
    name: 'ch.sbb.bahnhofplaene.printprodukte',
    visible: false,
    mapboxLayer: dataLayer,
    styleLayersFilter: ({ metadata }) =>
      !!metadata && metadata['trafimage.filter'] === 'printprodukte',
    properties: {
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.printprodukte-desc',
      popupComponent: 'StationPopup',
      radioGroup: 'bahnhofplaene',
      useOverlay: true,
    },
  }),
];

export const punctuality = new Layer({
  name: 'ch.sbb.puenktlichkeit',
  visible: false,
  isQueryable: false,
  properties: {
    hasAccessibility: true,
    hasInfos: true,
    layerInfoComponent: 'PunctualityLayerInfo',
  },
});

punctuality.children = [
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-nv',
    visible: false,
    useDelayStyle: true,
    tenant: 'sbb',
    minZoomNonTrain: 14,
    regexPublishedLineName: '^(S|R$|RE|PE|D|IRE|RB|TER)',
    properties: {
      radioGroup: 'ch.sbb.punctuality',
    },
  }),
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-fv',
    visible: false,
    useDelayStyle: true,
    tenant: 'sbb',
    minZoomNonTrain: 14,
    regexPublishedLineName: '(IR|IC|EC|RJX|TGV)',
    properties: {
      radioGroup: 'ch.sbb.punctuality',
    },
  }),
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-all',
    visible: false,
    useDelayStyle: true,
    tenant: 'sbb',
    minZoomNonTrain: 14,
    properties: {
      radioGroup: 'ch.sbb.punctuality',
    },
  }),
];

export const stationsLayer = new StationsLayer({
  name: 'ch.sbb.netzkarte.stationen',
  mapboxLayer: dataLayer,
});

export const platformsLayer = new PlatformsLayer({
  name: 'ch.sbb.netzkarte.platforms',
  mapboxLayer: dataLayer,
});

export const buslines = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.buslinien',
  mapboxLayer: dataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'bus',
  visible: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'BuslinesLayerInfo',
    popupComponent: 'BusLinePopup',
    useOverlay: true,
  },
});

export const gemeindegrenzen = new MapboxStyleLayer({
  name: 'ch.sbb.ch_gemeinden',
  mapboxLayer: dataLayer,
  visible: false,
  isQueryable: false,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['trafimage.filter'] === 'municipality_borders',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.ch_gemeinden-desc',
  },
});

const DIREKTVERBINDUNGEN_KEY = 'ch.sbb.direktverbindungen';

export const direktverbindungenDay = new DirektverbindungenLayer({
  name: `${DIREKTVERBINDUNGEN_KEY}.day`,
  mapboxLayer: dataLayer,
  visible: false,
  properties: {
    routeType: 'day',
    hasInfos: true,
    layerInfoComponent: 'DirektVerbindungenTagLayerInfo',
    popupComponent: 'DirektverbindungPopup',
    useOverlay: true,
    priorityFeatureInfo: true, // This property will block display of others featureInfos
  },
});

export const direktverbindungenNight = new DirektverbindungenLayer({
  name: `${DIREKTVERBINDUNGEN_KEY}.night`,
  mapboxLayer: dataLayer,
  visible: false,
  properties: {
    routeType: 'night',
    hasInfos: true,
    layerInfoComponent: 'DirektVerbindungenNachtLayerInfo',
    popupComponent: 'DirektverbindungPopup',
    useOverlay: true,
    priorityFeatureInfo: true, // This property will block display of others featureInfos
  },
});

export const direktverbindungenLayer = new Layer({
  name: DIREKTVERBINDUNGEN_KEY,
  children: [direktverbindungenDay, direktverbindungenNight],
  isQueryable: false,
  visible: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'DirektVerbindungenLayerInfo',
  },
});
export const defaultBaseLayers = [
  dataLayer,
  netzkarteLayer,
  netzkarteNight,
  swisstopoSwissImage,
  swisstopoLandeskarte,
  swisstopoLandeskarteGrau,
];

export default [
  ...defaultBaseLayers,
  punctuality,
  stationsLayer,
  platformsLayer,
  passagierfrequenzen,
  gemeindegrenzen,
  buslines,
  bahnhofplaene,
  direktverbindungenLayer,
];
