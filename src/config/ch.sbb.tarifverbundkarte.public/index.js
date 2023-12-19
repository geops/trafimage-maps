import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import TarifverbundkarteLayer from "../../layers/TarifverbundkarteLayer";

export const tarifverbundkarteDataLayer = new TrafimageMapboxLayer({
  name: "ch.sbb.tarifverbundkarte.data",
  visible: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: "ch.sbb.tarifverbund",
  properties: {
    hideInLegend: true,
    isBaseLayer: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const tarifverbundkarteLayer = new TarifverbundkarteLayer({
  mapboxLayer: tarifverbundkarteDataLayer,
  visible: true,
  properties: {
    isQueryable: true,
    hideInLegend: true,
    useOverlay: true,
    popupComponent: "TarifverbundkartePopup",
  },
});
export default [tarifverbundkarteDataLayer, tarifverbundkarteLayer];
