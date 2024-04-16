import {
  TrafimageMapboxLayer,
  MesswagenLayer,
  MapboxStyleLayer,
} from "../../layers";
import {
  netzkarteLayer,
  netzkarteAerial,
  swisstopoLandeskarte,
  swisstopoLandeskarteGrau,
} from "../ch.sbb.netzkarte";

const messwagenDataLayer = new TrafimageMapboxLayer({
  name: "ch.sbb.funkmesswagen.data",
  visible: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: "base_bright_v2_ch.sbb.funkmesswagen",
  properties: {
    hideInLegend: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

const messwagenNetzkarte = netzkarteLayer.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.funkmesswagen.netzkarte`,
  visible: false,
  style: "base_bright_v2_ch.sbb.funkmesswagen",
});

const messwagenNetzkarteNight = new MapboxStyleLayer({
  name: "ch.sbb.netzkarte.dark",
  key: "ch.sbb.funkmesswagen.night",
  group: "baseLayer",
  properties: {
    isBaseLayer: true,
    previewImage: "ch.sbb.netzkarte.dark",
  },
  visible: false,
  mapboxLayer: messwagenDataLayer,
  style: "base_dark_v2_ch.sbb.funkmesswagen",
});

const messwagenNetzkarteAerial = netzkarteAerial.clone({
  mapboxLayer: messwagenDataLayer,
  style: "aerial_sbb_sbbkey_ch.sbb.funkmesswagen",
});

const messwagenLandeskarte = swisstopoLandeskarte.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.funkmesswagen.landeskarte`,
  visible: false,
  style: "ch.swisstopo.backgrounds_ch.sbb.funkmesswagen",
});

const messwagenLandeskarteGrau = swisstopoLandeskarteGrau.clone({
  mapboxLayer: messwagenDataLayer,
  key: `ch.sbb.funkmesswagen.landeskartegrau`,
  visible: false,
  style: "ch.swisstopo.backgrounds_ch.sbb.funkmesswagen",
});

const mewa12 = new MesswagenLayer({
  name: "ch.sbb.funkmesswagen.mewa12",
  group: "ch.sbb.funkmesswagen",
  visible: true,
  properties: {
    fileName: "mewa12",
  },
});

const mb = new MesswagenLayer({
  name: "ch.sbb.funkmesswagen.mb",
  group: "ch.sbb.funkmesswagen",
  visible: false,
  properties: {
    fileName: "mb",
  },
});

const mobile = new MesswagenLayer({
  name: "ch.sbb.funkmesswagen.mobile",
  group: "ch.sbb.funkmesswagen",
  visible: false,
  properties: {
    fileName: "mobile",
  },
});

const messwagenPhotos = new MapboxStyleLayer({
  name: "ch.sbb.funkmesswagen.fotos",
  key: "ch.sbb.funkmesswagen.fotos",
  styleLayersFilter: ({ metadata }) =>
    /^funkmesswagen.photos$/.test(metadata?.["trafimage.filter"]),
  visible: false,
  properties: {
    isBaseLayer: false,
    isQueryable: true,
    useOverlay: true,
    popupComponent: "MesswagenPhotosPopup",
    hasInfos: true,
    layerInfoComponent: "MesswagenPhotosLayerInfo",
  },
  mapboxLayer: messwagenDataLayer,
});

export default [
  messwagenDataLayer,
  messwagenNetzkarte,
  messwagenNetzkarteNight,
  messwagenNetzkarteAerial,
  messwagenLandeskarte,
  messwagenLandeskarteGrau,
  messwagenPhotos,
  mobile,
  mb,
  mewa12,
];
