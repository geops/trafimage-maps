import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import { DV_HIT_TOLERANCE, DV_KEY } from "../../utils/constants";
import DirektverbindungenSingleLayer from "../../layers/DirektverbindungenLayer/DirektverbindungenSingleLayer";

export const DV_DAY_LAYER_KEY = `${DV_KEY}.day`;
export const DV_NIGHT_LAYER_KEY = `${DV_KEY}.night`;

// eslint-disable-next-line import/prefer-default-export
export const getDirektverbindungenSingleLayers = () => {
  const dataLayer = new TrafimageMapboxLayer({
    name: `${DV_KEY}.data`,
    visible: true,
    zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
    style: "base_bright_v2_direktverbindungen_single",
    hitTolerance: DV_HIT_TOLERANCE,
    properties: {
      hideInLegend: true,
    },
    mapOptions: {
      preserveDrawingBuffer: true,
    },
  });

  const dvBaseLight = new MapboxStyleLayer({
    name: `${DV_KEY}.base-light`,
    key: `${DV_KEY}.base-light`,
    group: "baseLayer",
    properties: {
      previewImage: "ch.sbb.netzkarte",
      isBaseLayer: true,
      deselectOnChangeVisible: true,
    },
    visible: true,
    mapboxLayer: dataLayer,
    style: "base_bright_v2_direktverbindungen_single",
  });

  const dvBaseDark = new MapboxStyleLayer({
    name: `${DV_KEY}.base-dark`,
    key: `${DV_KEY}.base-dark`,
    group: "baseLayer",
    properties: {
      previewImage: "ch.sbb.netzkarte.dark",
      isBaseLayer: true,
      deselectOnChangeVisible: true,
    },
    visible: false,
    mapboxLayer: dataLayer,
    style: "base_dark_v2_direktverbindungen_single",
  });

  const dvBaseAerial = new MapboxStyleLayer({
    name: `${DV_KEY}.base-aerial`,
    key: `${DV_KEY}.base-aerial`,
    group: "baseLayer",
    properties: {
      previewImage: "ch.sbb.netzkarte.luftbild.group",
      isBaseLayer: true,
      deselectOnChangeVisible: true,
    },
    visible: false,
    mapboxLayer: dataLayer,
    style: "aerial_sbb_direktverbindungen_single",
  });

  const dvMain = new DirektverbindungenSingleLayer({
    visible: false,
    key: `${DV_KEY}.main`,
    mapboxLayer: dataLayer,
    styleLayersFilter: ({ metadata }) => {
      return !!metadata && /^ipv_single/.test(metadata?.["trafimage.filter"]);
    },
    queryRenderedLayersFilter: ({ metadata }) => {
      return !!metadata && /^ipv_single/.test(metadata?.["trafimage.filter"]);
    },
    properties: {
      popupComponent: "DvPopup",
      useOverlay: true,
    },
  });

  return [dataLayer, dvBaseLight, dvBaseDark, dvBaseAerial, dvMain];
};
