import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";

import {
  netzkarteLayer,
  netzkarteNight,
  stationsLayer,
  bahnhofplaene,
} from "../ch.sbb.netzkarte";

export const handicapDataLayer = new TrafimageMapboxLayer({
  name: "ch.sbb.handicap.data",
  visible: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: "base_bright_v2_ch.sbb.handicap_v2",
  properties: {
    hideInLegend: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
  group: "data",
});

const barrierefrei = new MapboxStyleLayer({
  name: "ch.sbb.barrierfreierbahnhoefe",
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ metadata }) => {
    return /^symbol.barrierfrei/.test(metadata?.["handicap.filter"]);
  },
  properties: {
    isQueryable: true,
    useOverlay: true,
    popupComponent: "StopPlacePopup",
  },
});

const nichtBarrierefrei = new MapboxStyleLayer({
  name: "ch.sbb.nichtbarrierfreierbahnhoefe",
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ metadata }) => {
    return /^symbol.nichtbarrierfrei/.test(metadata?.["handicap.filter"]);
  },
  properties: {
    isQueryable: true,
    useOverlay: true,
    popupComponent: "StopPlacePopup",
  },
});

const teilBarrierefrei = new MapboxStyleLayer({
  name: "ch.sbb.teilbarrierfreierbahnhoefe",
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ metadata }) => {
    return /^symbol.teilbarrierfrei/.test(metadata?.["handicap.filter"]);
  },
  properties: {
    isQueryable: true,
    useOverlay: true,
    popupComponent: "StopPlacePopup",
  },
});

const shuttle = new MapboxStyleLayer({
  name: "ch.sbb.shuttle",
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ metadata }) => {
    return /^symbol.shuttle/.test(metadata?.["handicap.filter"]);
  },
  properties: {
    isQueryable: true,
    useOverlay: true,
    popupComponent: "StopPlacePopup",
  },
});

const statusUnbekannt = new MapboxStyleLayer({
  name: "ch.sbb.status_unbekannt",
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ metadata }) => {
    return /^symbol.statusunbekannt/.test(metadata?.["handicap.filter"]);
  },
  properties: {
    isQueryable: true,
    useOverlay: true,
    popupComponent: "StopPlacePopup",
  },
});

// TODO: keep this layer until we are sure we will not use it.
// export const stuetzpunktBahnhoefe = new MapboxStyleLayer({
//   name: 'ch.sbb.stuetzpunktbahnhoefe',
//   key: 'ch.sbb.stuetzpunktbahnhoefe',
//   visible: true,
//   mapboxLayer: handicapDataLayer,
//   styleLayersFilter: ({ metadata }) =>
//     !!metadata && metadata['trafimage.filter'] === 'stuetzpunkt',
//   properties: {
//     isQueryable: true,
//     handicapType: 'stuetzpunkt',
//     hasInfos: true,
//     layerInfoComponent: 'HandicapLayerInfo',
//     popupComponent: 'HandicapPopup',
//     useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
//   },
//   hidePopup: (feat, layer, featureInfo) => {
//     const otherFeatsClicked = featureInfo
//       .filter((info) => info.layer !== layer)
//       .map((info) => info.features)
//       .flat()
//       .map((f) => f.get('stationsbezeichnung'));

//     return otherFeatsClicked.includes(feat.get('stationsbezeichnung'));
//   },
// });

// TODO: keep this layer until we are sure we will not use it.
// export const barrierfreierBahnhoefe = new MapboxStyleLayer({
//   name: 'ch.sbb.barrierfreierbahnhoefe',
//   key: 'ch.sbb.barrierfreierbahnhoefe',
//   visible: true,
//   mapboxLayer: handicapDataLayer,
//   styleLayersFilter: ({ metadata }) =>
//     !!metadata && metadata['trafimage.filter'] === 'barrierefrei',
//   properties: {
//     isQueryable: true,
//     handicapType: 'barrierfree',
//     hasInfos: true,
//     layerInfoComponent: 'HandicapLayerInfo',
//     popupComponent: 'HandicapPopup',
//     useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
//   },
// });

// TODO: keep this layer until we are sure we will not use it.
// export const nichtBarrierfreierBahnhoefe = new MapboxStyleLayer({
//   name: 'ch.sbb.nichtbarrierfreierbahnhoefe',
//   key: 'ch.sbb.nichtbarrierfreierbahnhoefe',
//   visible: true,
//   mapboxLayer: handicapDataLayer,
//   styleLayersFilter: ({ metadata }) =>
//     !!metadata && metadata['trafimage.filter'] === 'nicht_barrierefrei',
//   properties: {
//     isQueryable: true,
//     handicapType: 'notBarrierfree',
//     hasInfos: true,
//     layerInfoComponent: 'HandicapLayerInfo',
//     popupComponent: 'HandicapPopup',
//     useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
//   },
// });

export default [
  handicapDataLayer,
  netzkarteLayer.clone({
    mapboxLayer: handicapDataLayer,
    style: "base_bright_v2_ch.sbb.handicap_v2",
  }),
  netzkarteNight.clone({
    mapboxLayer: handicapDataLayer,
    style: "base_dark_v2_ch.sbb.handicap_v2",
  }),
  // netzkarteAerial.clone({
  //   mapboxLayer: handicapDataLayer,
  //   style: 'aerial_sbb_sbbkey_ch.sbb.handicap_v2',
  // }),
  // swisstopoLandeskarte.clone({
  //   mapboxLayer: handicapDataLayer,
  //   style: 'ch.swisstopo.backgrounds_ch.sbb.handicap_v2',
  // }),
  // swisstopoLandeskarteGrau.clone({
  //   mapboxLayer: handicapDataLayer,
  //   style: 'ch.swisstopo.backgrounds_ch.sbb.handicap_v2',
  // }),
  stationsLayer.clone({
    mapboxLayer: handicapDataLayer,
  }),
  bahnhofplaene.clone({
    children: bahnhofplaene.children.map((layer) =>
      layer.clone({
        mapboxLayer: handicapDataLayer,
      }),
    ),
  }),
  statusUnbekannt,
  shuttle,
  nichtBarrierefrei,
  teilBarrierefrei,
  barrierefrei,
  // nichtBarrierfreierBahnhoefe,
  // barrierfreierBahnhoefe,
  // stuetzpunktBahnhoefe,
];
