import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import { dataLayer, netzkarteLayer, geschosseLayer } from "../ch.sbb.netzkarte";

const sandboxDataLayer = dataLayer.clone({
  key: "ch.sbb.netzkarte.sandbox.data",
});
const sandboxNetzkarteLayer = netzkarteLayer.clone({
  key: "ch.sbb.netzkarte.sandbox",
  mapboxLayer: sandboxDataLayer,
});

export const poiLayer = new MapboxStyleLayer({
  name: "Teststyle",
  key: "ch.sbb.temp_entwicklungsstyle",
  group: "baseLayer",
  properties: {
    previewImage: "ch.sbb.netzkarte",
    isBaseLayer: true,
    hideInLegend: true,
    hasLevels: true,
  },
  visible: false,
  mapboxLayer: sandboxDataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "perimeter_mask",
  style: "temp_entwicklungsstyle",
});

export const sandboxGeschosseLayer = geschosseLayer.clone({
  properties: {
    hideInLayerTree: false,
  },
});

sandboxGeschosseLayer.children = geschosseLayer.children
  .slice(2, 12) // only show levels from -4 to 4
  .map((layer) => {
    return layer.clone({
      mapboxLayer: sandboxDataLayer,
      group: "ch.sbb.geschosse-layer",
      properties: {
        parent: sandboxGeschosseLayer,
        hideInLayerTree: false,
      },
    });
  });

export default [
  sandboxDataLayer,
  sandboxNetzkarteLayer,
  poiLayer,
  sandboxGeschosseLayer,
];
