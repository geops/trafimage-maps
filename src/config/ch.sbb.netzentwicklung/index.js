import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import { kilometrageLayer } from "../ch.sbb.infrastruktur";

export const netzentwicklungDataLayer = new TrafimageMapboxLayer({
  name: "ch.sbb.netzkarte.data",
  zIndex: -1,
  style: "netzkarte_eisenbahninfrastruktur_v3_ch.sbb.netzentwicklung",
  properties: {
    hideInLegend: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const netzentwicklungProgrammManagerLayer = new MapboxStyleLayer({
  name: "ch.sbb.netzentwicklung.programm_manager",
  mapboxLayer: netzentwicklungDataLayer,
  visible: true,
  styleLayersFilter: ({ id }) => /programm_manager/.test(id),
  queryRenderedLayersFilter: ({ id }) => /programm_manager$/.test(id),
  group: "netzentwicklung",
  properties: {
    isQueryable: true,
    popupComponent: "NetzentwicklungPopup",
    netzentwicklungRoleType: "Programm Manager", // display only roles of this type
    hasInfos: true,
    useOverlay: true,
    layerInfoComponent: "NetzentwicklungLayerInfo",
  },
});

export const netzentwicklungStrategischLayer = new MapboxStyleLayer({
  name: "ch.sbb.netzentwicklung.strategisch",
  mapboxLayer: netzentwicklungDataLayer,
  visible: false,
  styleLayersFilter: ({ id }) => /strategisch/.test(id),
  queryRenderedLayersFilter: ({ id }) => /strategisch$/.test(id),
  group: "netzentwicklung",
  properties: {
    isQueryable: true,
    popupComponent: "NetzentwicklungPopup",
    netzentwicklungRoleType: "Netzentwickler Strategisch", // display only roles of this type
    hasInfos: true,
    useOverlay: true,
    layerInfoComponent: "NetzentwicklungLayerInfo",
  },
});

export const netzentwicklungGueterverkehrLayer = new MapboxStyleLayer({
  name: "ch.sbb.netzentwicklung.gueterverkehr",
  mapboxLayer: netzentwicklungDataLayer,
  visible: false,
  styleLayersFilter: ({ id }) => /gueterverkehr/.test(id),
  queryRenderedLayersFilter: ({ id }) => /gueterverkehr$/.test(id),
  group: "netzentwicklung",
  properties: {
    isQueryable: true,
    popupComponent: "NetzentwicklungPopup",
    netzentwicklungRoleType: "Netzentwickler Güterverkehr", // display only roles of this type
    hasInfos: true,
    useOverlay: true,
    layerInfoComponent: "NetzentwicklungLayerInfo",
  },
});

export default [
  kilometrageLayer,
  netzentwicklungDataLayer,
  netzentwicklungGueterverkehrLayer,
  netzentwicklungStrategischLayer,
  netzentwicklungProgrammManagerLayer,
];
