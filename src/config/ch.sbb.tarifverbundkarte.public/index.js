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
    maxExtent: [599266.3018, 5672238.995, 1232164.896, 6132695.6534],
  },
});
export default [tarifverbundkarteDataLayer, tarifverbundkarteLayer];
