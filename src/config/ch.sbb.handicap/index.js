import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";

import {
  netzkarteLayer,
  netzkarteNight,
  netzkarteAerial,
  stationsLayer,
  bahnhofplaene,
  swisstopoLandeskarte,
  swisstopoLandeskarteGrau,
} from "../ch.sbb.netzkarte";

export const handicapDataLayer = new TrafimageMapboxLayer({
  name: "ch.sbb.handicap.data",
  visible: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: "base_bright_v2_ch.sbb.handicap",
  properties: {
    hideInLegend: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const barrierfreierBahnhoefe = new MapboxStyleLayer({
  name: "ch.sbb.barrierfreierbahnhoefe",
  key: "ch.sbb.barrierfreierbahnhoefe",
  visible: true,
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "barrierefrei",
  properties: {
    isQueryable: true,
    handicapType: "barrierfree",
    hasInfos: true,
    layerInfoComponent: "HandicapLayerInfo",
    popupComponent: "HandicapPopup",
    useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
  },
});

export const nichtBarrierfreierBahnhoefe = new MapboxStyleLayer({
  name: "ch.sbb.nichtbarrierfreierbahnhoefe",
  key: "ch.sbb.nichtbarrierfreierbahnhoefe",
  visible: true,
  mapboxLayer: handicapDataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "nicht_barrierefrei",
  properties: {
    isQueryable: true,
    handicapType: "notBarrierfree",
    hasInfos: true,
    layerInfoComponent: "HandicapLayerInfo",
    popupComponent: "HandicapPopup",
    useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
  },
});

export default [
  handicapDataLayer,
  netzkarteLayer.clone({
    mapboxLayer: handicapDataLayer,
    style: "base_bright_v2_ch.sbb.handicap",
  }),
  netzkarteNight.clone({
    mapboxLayer: handicapDataLayer,
    style: "base_dark_v2_ch.sbb.handicap",
  }),
  netzkarteAerial.clone({
    mapboxLayer: handicapDataLayer,
    style: "aerial_sbb_sbbkey_ch.sbb.handicap",
  }),
  swisstopoLandeskarte.clone({
    mapboxLayer: handicapDataLayer,
    style: "ch.swisstopo.backgrounds_ch.sbb.handicap",
  }),
  swisstopoLandeskarteGrau.clone({
    mapboxLayer: handicapDataLayer,
    style: "ch.swisstopo.backgrounds_ch.sbb.handicap",
  }),
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
  nichtBarrierfreierBahnhoefe,
  barrierfreierBahnhoefe,
];
