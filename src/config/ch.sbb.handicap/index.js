import { Style } from "ol/style";
import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import { createPointStyleRenderer } from "../../utils/highlightPointStyle";

import { getNetzkarteLayers } from "../ch.sbb.netzkarte";

import {
  BAHNHOFPLAENE_LAYER_NAME,
  MapsHandicapFilter,
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
    style: "basemap_bright_ch.sbb.handicap_v2",
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
    style: "basemap_bright_ch.sbb.handicap_v2",
  });

  const handicapDark = netzkarteNight.clone({
    mapboxLayer: handicapDataLayer,
    style: "basemap_dark_ch.sbb.handicap_v2",
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
      /^symbol.barrierefrei/.test(metadata?.[MapsHandicapFilter]),
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
      /^symbol.nichtbarrierefrei/.test(metadata?.[MapsHandicapFilter]),
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
      return /^symbol.teilbarrierefrei/.test(metadata?.[MapsHandicapFilter]);
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
  //     return /^symbol.shuttle/.test(metadata?.[MapsHandicapFilter]);
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
      return /^symbol.statusunbekannt/.test(metadata?.[MapsHandicapFilter]);
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

  return [
    handicapDataLayer,
    handicapLight,
    handicapDark,
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
    nichtBarrierefrei,
    teilBarrierefrei,
    barrierefrei,
  ];
};
