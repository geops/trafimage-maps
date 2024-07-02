import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import HighlightRoutesLayer from "../../layers/StsHighlightRoutesLayer";
import DirektverbindungenLayer from "../../layers/DirektverbindungenLayer";
import {
  DV_HIT_TOLERANCE,
  DV_KEY,
  STS_HIT_TOLERANCE,
  SWISS_EXTENT,
} from "../../utils/constants";
import StsPoisLayer from "../../layers/StsPoisLayer";
import { dvDay, dvNight } from "../ch.sbb.direktverbindungen";

const FILTER_KEY = "sts.filter";
const FILTER_GTTOS_VALUE = "sts_gttos";
const FILTER_PREMIUM_VALUE = "sts_premium";
const FILTER_HIGHLIGHT_VALUE = "sts_highlight";
const FILTER_OTHERS_VALUE = "sts_others";
const FILTER_LINE_VALUE = "sts.line"; // style using nova daten

const STS_VALIDITY_DATA_LAYER_KEY = "ch.sbb.sts.validity.data";
const STS_DIREKTVERBINDUNGEN_DATA_LAYER_KEY = "ch.sbb.direktverbindungen.data";
const HIGHLIGHTS_LAYER_KEY = "ch.sbb.sts.validity.highlights";
const ROUTES_HIGHLIGHT_LAYER_KEY = "ch.sbb.sts.validity.routes_highlight";
const STS_HIDDEN_ROUTES_LAYER_KEY = "ch.sbb.sts.validity.hidden";
const OTHER_LAYER_KEY = "ch.sbb.sts.validity.other";
const GTTOS_LAYER_KEY = "ch.sbb.sts.validity.gttos";
const PREMIUM_LAYER_KEY = "ch.sbb.sts.validity.premium";

const stsValidityDataLayer = new TrafimageMapboxLayer({
  name: STS_VALIDITY_DATA_LAYER_KEY,
  key: STS_VALIDITY_DATA_LAYER_KEY,
  visible: true,
  preserveDrawingBuffer: false,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: "base_bright_v2_ch.sbb.geltungsbereiche_ga",
  hitTolerance: STS_HIT_TOLERANCE,
  properties: {
    isQueryable: false,
    isBaseLayer: true,
    hideInLegend: true,
  },
});

const stsDirektverbindungenDataLayer = new TrafimageMapboxLayer({
  name: STS_DIREKTVERBINDUNGEN_DATA_LAYER_KEY,
  key: STS_DIREKTVERBINDUNGEN_DATA_LAYER_KEY,
  visible: false,
  preserveDrawingBuffer: false,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: "base_bright_v2_direktverbindungen",
  hitTolerance: DV_HIT_TOLERANCE,
  properties: {
    isQueryable: false,
    isBaseLayer: true,
    hideInLegend: true,
  },
});

export const highlights = new StsPoisLayer({
  name: "Highlights",
  key: HIGHLIGHTS_LAYER_KEY,
  visible: false,
  properties: {
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
    maxExtent: SWISS_EXTENT,
    minZoom: 8,
  },
});

export const highlightRoutes = new HighlightRoutesLayer({
  name: "Highlight routes",
  key: ROUTES_HIGHLIGHT_LAYER_KEY,
  mapboxLayer: stsValidityDataLayer,
  visible: true,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_HIGHLIGHT_VALUE,
  properties: {
    isQueryable: false,
    disableSetFeatureInfoOnHover: true,
    maxExtent: SWISS_EXTENT,
    minZoom: 8,
  },
});

// Hide the routes displayed by default like gqa ones
const hiddenRoutes = new MapboxStyleLayer({
  name: "Hidden routes",
  key: STS_HIDDEN_ROUTES_LAYER_KEY,
  mapboxLayer: stsValidityDataLayer,
  visible: false,
  styleLayersFilter: ({ metadata, id }) =>
    /^gb_Fanas_Bus/.test(id) ||
    !!(
      metadata &&
      metadata["geltungsbereiche.filter"] &&
      /(hta|ga|tk)\.line/.test(metadata["geltungsbereiche.filter"] || "")
    ),
  properties: {
    isQueryable: true,
    minZoom: 8,
  },
});

export const otherRoutes = new MapboxStyleLayer({
  name: "Other routes",
  key: OTHER_LAYER_KEY,
  mapboxLayer: stsValidityDataLayer,
  visible: true,
  styleLayersFilter: ({ metadata }) => {
    return (
      metadata &&
      (metadata[FILTER_KEY] === FILTER_OTHERS_VALUE ||
        (metadata["geltungsbereiche.filter"] &&
          metadata["geltungsbereiche.filter"].includes(FILTER_LINE_VALUE)))
    );
  },
  properties: {
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
    validPropertyName: "valid_sts",
    getTextFromValid: (valid) => {
      if (valid === 50) {
        return "50% Ermässigung";
      }
      if (valid === 25) {
        return "25% Ermässigung";
      }
      if (valid === -1) {
        return "Gültigkeit vor Ort erfragen";
      }
      return "Freie Fahrt";
    },
    maxExtent: SWISS_EXTENT,
    minZoom: 8,
    products: [
      "ch.sbb.geltungsbereiche.products.sts",
      "ch.sbb.geltungsbereiche.products.sts-half",
    ],
    lineDashArray50: [6, 8],
    lineDashArray25: [6, 8, 1, 8, 1, 8],
  },
});

export const gttos = new MapboxStyleLayer({
  name: "Grand Train Tour of Switzerland",
  key: GTTOS_LAYER_KEY,
  mapboxLayer: stsValidityDataLayer,
  visible: true,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_GTTOS_VALUE,
  group: "ch.sbb.sts.validity.group",
  properties: {
    isQueryable: true,
    disableSetFeatureInfoOnHover: true,
    maxExtent: SWISS_EXTENT,
    minZoom: 8,
  },
});

export const premium = new MapboxStyleLayer({
  name: "Premium Panoramic Trains",
  key: PREMIUM_LAYER_KEY,
  mapboxLayer: stsValidityDataLayer,
  visible: false,
  group: "ch.sbb.sts.validity.group",
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata[FILTER_KEY] === FILTER_PREMIUM_VALUE,
  properties: {
    disableSetFeatureInfoOnHover: true,
    isQueryable: true,
    maxExtent: SWISS_EXTENT,
    minZoom: 8,
  },
});

const stsDvDay = dvDay.clone({
  mapboxLayer: stsDirektverbindungenDataLayer,
  visible: false,
});

const stsDvNight = dvNight.clone({
  mapboxLayer: stsDirektverbindungenDataLayer,
  visible: false,
});

export const stsDvMain = new DirektverbindungenLayer({
  visible: false,
  name: `${DV_KEY}.main`,
  key: `${DV_KEY}.main`,
  mapboxLayer: stsDirektverbindungenDataLayer,
  properties: {
    isQueryable: true,
    hideInLegend: true,
    dayLayer: stsDvDay,
    nightLayer: stsDvNight,
    popupComponent: "DvPopup",
    useOverlay: true,
    priorityFeatureInfo: true, // This property will block display of others featureInfos
    highlightPointFeatureFilter: () => false,
  },
});

// [stsDvDay, stsDvNight].forEach((layer) => {
//   layer.on("change:visible", () => {
//     stsDvMain.visible = stsDvDay.visible || stsDvNight.visible;
//   });
// });

export default [
  stsValidityDataLayer,
  stsDirektverbindungenDataLayer,
  hiddenRoutes,
  otherRoutes,
  highlightRoutes,
  premium,
  gttos,
  highlights,
  stsDvMain,
  stsDvDay,
  stsDvNight,
];
