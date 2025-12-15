import { Style } from "ol/style";
import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import { createPointStyleRenderer } from "../../utils/highlightPointStyle";

import { getNetzkarteLayers } from "../ch.sbb.netzkarte";

import {
  BAHNHOFPLAENE_LAYER_NAME,
  NETZKARTE_DARK_LAYER_NAME,
  NETZKARTE_LAYER_NAME,
  STATIONS_LAYER_NAME,
} from "../../utils/constants";
import HandicapLayer from "../../layers/HandicapLayer";

// eslint-disable-next-line import/prefer-default-export
export const getHandicapLayers = () => {
  const layers = getNetzkarteLayers();

  const netzkarteLayer = layers.find((l) => l.name === NETZKARTE_LAYER_NAME);
  const netzkarteNight = layers.find(
    (l) => l.name === NETZKARTE_DARK_LAYER_NAME,
  );

  const stationsLayer = layers.find((l) => l.name === STATIONS_LAYER_NAME);

  const bahnhofplaene = layers.find((l) => l.name === BAHNHOFPLAENE_LAYER_NAME);

  const handicapDataLayer = new TrafimageMapboxLayer({
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

  const handicapLight = netzkarteLayer.clone({
    mapboxLayer: handicapDataLayer,
    style: "base_bright_v2_ch.sbb.handicap_v2",
  });

  const handicapDark = netzkarteNight.clone({
    mapboxLayer: handicapDataLayer,
    style: "base_dark_v2_ch.sbb.handicap_v2_dark",
  });

  const handicapHighlightStyleMain = new Style({
    renderer: createPointStyleRenderer([
      { offsetX: 0, offsetY: -25, radius: 25, resolution: 19.5 },
      { offsetX: 0, offsetY: -28, radius: 25, resolution: 9 },
      { offsetX: 0, offsetY: -32, radius: 25, resolution: 4.8 },
      { offsetX: 0, offsetY: -35, radius: 25, resolution: 2.5 },
      { offsetX: -1, offsetY: -32, radius: 25, resolution: 0.8 },
    ]),
  });
  const handicapHighlightStyleSecondary = new Style({
    renderer: createPointStyleRenderer([
      { offsetX: 0, offsetY: -15, radius: 15, resolution: 5 },
      { offsetX: 0, offsetY: -18, radius: 18, resolution: 2.4 },
      { offsetX: 0, offsetY: -20, radius: 20, resolution: 2 },
      { offsetX: 0, offsetY: -22, radius: 20, resolution: 1.7 },
      { offsetX: 0, offsetY: -25, radius: 22, resolution: 1.5 },
      { offsetX: -1, offsetY: -25, radius: 22, resolution: 0.4 },
    ]),
  });

  const barrierefrei = new HandicapLayer({
    name: "ch.sbb.barrierfreierbahnhoefe",
    mapboxLayer: handicapDataLayer,
    styleLayersFilter: ({ metadata }) =>
      /^symbol.barrierefrei/.test(metadata?.["handicap.filter"]),
    properties: {
      isQueryable: true,
      useOverlay: true,
      popupComponent: "StopPlacePopup",
      highlightPointStyle: handicapHighlightStyleMain,
      hasInfos: true,
      layerInfoComponent: "HandicapLayerInfo",
      color: "#01973D",
    },
  });

  const nichtBarrierefrei = new HandicapLayer({
    name: "ch.sbb.nichtbarrierfreierbahnhoefe",
    mapboxLayer: handicapDataLayer,
    styleLayersFilter: ({ metadata }) =>
      /^symbol.nichtbarrierefrei/.test(metadata?.["handicap.filter"]),
    properties: {
      isQueryable: true,
      useOverlay: true,
      popupComponent: "StopPlacePopup",
      highlightPointStyle: handicapHighlightStyleSecondary,
      hasInfos: true,
      layerInfoComponent: "HandicapLayerInfo",
      color: "#C60019",
    },
  });

  const teilBarrierefrei = new HandicapLayer({
    name: "ch.sbb.teilbarrierefreiebahnhoefe",
    mapboxLayer: handicapDataLayer,
    styleLayersFilter: ({ metadata }) => {
      return /^symbol.teilbarrierefrei/.test(metadata?.["handicap.filter"]);
    },
    properties: {
      isQueryable: true,
      useOverlay: true,
      popupComponent: "StopPlacePopup",
      highlightPointStyle: handicapHighlightStyleMain,
      hasInfos: true,
      layerInfoComponent: "HandicapLayerInfo",
      color: "#F17E00",
    },
  });

  // TODO: We need to wait for ROKAS to add data for this layer.
  // const shuttle = new MapboxStyleLayer({
  //   name: "ch.sbb.shuttle",
  //   mapboxLayer: handicapDataLayer,
  //   styleLayersFilter: ({ metadata }) => {
  //     return /^symbol.shuttle/.test(metadata?.["handicap.filter"]);
  //   },
  //   properties: {
  //     isQueryable: true,
  //     useOverlay: true,
  //     popupComponent: "StopPlacePopup",
  //     highlightPointStyle: handicapHighlightStyleSecondary,
  //   },
  // });

  const statusUnbekannt = new HandicapLayer({
    name: "ch.sbb.status_unbekannt",
    mapboxLayer: handicapDataLayer,
    styleLayersFilter: ({ metadata }) => {
      return /^symbol.statusunbekannt/.test(metadata?.["handicap.filter"]);
    },
    queryRenderedLayers: ({ metadata }) => {
      return /^symbol.statusunbekannt$/.test(metadata?.["handicap.filter"]);
    },
    properties: {
      isQueryable: true,
      useOverlay: true,
      popupComponent: "StopPlacePopup",
      highlightPointStyle: handicapHighlightStyleSecondary,
      hasInfos: true,
      layerInfoComponent: "HandicapLayerInfo",
      color: "#686868",
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
  // export const nichtBarrierefreieBahnhoefe = new MapboxStyleLayer({
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

  return [
    handicapDataLayer,
    handicapLight,
    handicapDark,
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
      properties: {
        ...bahnhofplaene.getProperties(),
        dataLink: null,
        dataService: false,
      },
    }),
    statusUnbekannt,
    // shuttle,
    nichtBarrierefrei,
    teilBarrierefrei,
    barrierefrei,
    // nichtBarrierefreieBahnhoefe,
    // barrierfreierBahnhoefe,
    // stuetzpunktBahnhoefe,
  ];
};
