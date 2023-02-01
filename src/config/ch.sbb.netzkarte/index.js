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
import { DIREKTVERBINDUNGEN_KEY } from '../../utils/constants';

export const dataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.data',
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

export const netzkarteLayer = new MapboxStyleLayer({
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
  style: 'base_bright_v2_ch.sbb.netzkarte',
});

export const netzkarteNight = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.dark',
  key: 'ch.sbb.netzkarte.dark',
  group: 'baseLayer',
  properties: {
    previewImage: netzkarteNightImg,
    isBaseLayer: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'base_dark_v2_ch.sbb.netzkarte',
});

export const netzkarteAerial = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.luftbild.group',
  key: 'ch.sbb.netzkarte.luftbild.group',
  group: 'baseLayer',
  properties: {
    previewImage: luftbild,
    isBaseLayer: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'aerial_sbb_sbbkey_ch.sbb.netzkarte.aerial',
});

export const swisstopoSwissImage = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.luftbild.group',
  key: 'ch.sbb.netzkarte.luftbild.group.old',
  group: 'baseLayer',
  properties: {
    previewImage: luftbild,
    isBaseLayer: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'ch.swisstopo.backgrounds_ch.sbb.netzkarte.swisstopo',
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'swissimage',
});

export const swisstopoLandeskarte = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.landeskarte',
  key: 'ch.sbb.netzkarte.landeskarte',
  group: 'baseLayer',
  properties: {
    previewImage: landeskarte,
    isBaseLayer: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'ch.swisstopo.backgrounds_ch.sbb.netzkarte.swisstopo',
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'pixelkarte_farbe',
});

export const swisstopoLandeskarteGrau = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.landeskarte.grau',
  key: 'ch.sbb.netzkarte.landeskarte.grau',
  group: 'baseLayer',
  properties: {
    previewImage: landeskarteGrau,
    isBaseLayer: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: 'ch.swisstopo.backgrounds_ch.sbb.netzkarte.swisstopo',
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
    isQueryable: true,
    hasInfos: true,
    layerInfoComponent: 'PassagierFrequenzenLayerInfo',
    popupComponent: 'PassagierFrequenzenPopup',
    useOverlay: true,
    dataLink: 'https://reporting.sbb.ch/bahnhoefe',
    dataLinkPortalName: 'Statistikportal',
  },
});

export const bahnhofplaene = new Layer({
  name: 'ch.sbb.bahnhofplaene',
  visible: false,
  isQueryable: false,
  properties: {
    isQueryable: true,
    hasInfos: true,
    description: 'ch.sbb.bahnhofplaene-desc',
    dataLink:
      'https://data.sbb.ch/explore/dataset/haltestelle-karte-trafimage/information/',
    dataService: true,
  },
});
bahnhofplaene.children = [
  new MapboxStyleLayer({
    name: 'ch.sbb.bahnhofplaene.interaktiv',
    visible: false,
    mapboxLayer: dataLayer,
    styleLayersFilter: ({ metadata }) =>
      !!metadata && metadata['trafimage.filter'] === 'interaktiv',
    group: 'bahnhofplaene',
    properties: {
      isQueryable: true,
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.interaktiv-desc',
      popupComponent: 'StationPopup',
      useOverlay: true,
    },
  }),
  new MapboxStyleLayer({
    name: 'ch.sbb.bahnhofplaene.printprodukte',
    visible: false,
    mapboxLayer: dataLayer,
    styleLayersFilter: ({ metadata }) =>
      !!metadata && metadata['trafimage.filter'] === 'printprodukte',
    group: 'bahnhofplaene',
    properties: {
      isQueryable: true,
      hasInfos: true,
      description: 'ch.sbb.bahnhofplaene.printprodukte-desc',
      popupComponent: 'StationPopup',
      useOverlay: true,
    },
  }),
];

export const punctuality = new Layer({
  name: 'ch.sbb.puenktlichkeit',
  visible: false,
  properties: {
    hasAccessibility: true,
    hasInfos: true,
    layerInfoComponent: 'PunctualityLayerInfo',
  },
});

punctuality.children = [
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-gondola',
    visible: false,
    tenant: 'sbb',
    filter: ({ properties }) => properties?.type === 'gondola',
    properties: {
      isQueryable: true,
      popupComponent: 'PunctualityPopup',
      useTrackerMenu: true,
    },
  }),
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-funicular',
    visible: false,
    tenant: 'sbb',
    filter: ({ properties }) =>
      properties?.type && /^(funicular|cablecar)$/.test(properties.type),
    properties: {
      isQueryable: true,
      popupComponent: 'PunctualityPopup',
      useTrackerMenu: true,
    },
  }),
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-ferry',
    visible: false,
    tenant: 'sbb',
    filter: ({ properties }) => properties?.type === 'ferry',
    properties: {
      isQueryable: true,
      popupComponent: 'PunctualityPopup',
      useTrackerMenu: true,
    },
  }),
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-bus',
    visible: false,
    tenant: 'sbb',
    filter: ({ properties }) => properties?.type === 'bus',
    properties: {
      isQueryable: true,
      popupComponent: 'PunctualityPopup',
      useTrackerMenu: true,
    },
  }),
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-tram',
    visible: false,
    tenant: 'sbb',
    filter: ({ properties }) =>
      properties?.type && /^(tram|subway)$/.test(properties.type),
    properties: {
      isQueryable: true,
      popupComponent: 'PunctualityPopup',
      useTrackerMenu: true,
    },
  }),
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-nv',
    visible: false,
    tenant: 'sbb',
    filter: ({ properties }) => {
      const { type, line } = properties;
      return (
        type &&
        line?.name &&
        type === 'rail' &&
        /^(S|R$|RE|PE|D|IRE|RB|TER)/.test(line.name)
      );
    },
    properties: {
      isQueryable: true,
      popupComponent: 'PunctualityPopup',
      useTrackerMenu: true,
    },
  }),
  new TralisLayer({
    isUpdateBboxOnMoveEnd: true,
    name: 'ch.sbb.puenktlichkeit-fv',
    visible: false,
    tenant: 'sbb',
    filter: ({ properties }) => {
      const { type, line } = properties;
      return (
        type &&
        line?.name &&
        type === 'rail' &&
        /(IR|IC|EC|RJX|TGV)/.test(line.name)
      );
    },
    properties: {
      isQueryable: true,
      popupComponent: 'PunctualityPopup',
      useTrackerMenu: true,
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
    isQueryable: (map) => {
      return map.getView().getZoom() >= 15;
    },
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
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata['trafimage.filter'] === 'municipality_borders',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.ch_gemeinden-desc',
  },
});

export const direktverbindungenDay = new DirektverbindungenLayer({
  name: `${DIREKTVERBINDUNGEN_KEY}.day`,
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
  name: `${DIREKTVERBINDUNGEN_KEY}.night`,
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
  name: DIREKTVERBINDUNGEN_KEY,
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
export const defaultBaseLayers = [
  dataLayer,
  netzkarteLayer,
  netzkarteNight,
  netzkarteAerial,
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
