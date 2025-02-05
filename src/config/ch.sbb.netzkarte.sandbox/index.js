import { Layer } from "mobility-toolbox-js/ol";
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
  },
  visible: false,
  mapboxLayer: sandboxDataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "perimeter_mask",
  style: "temp_entwicklungsstyle",
});

export const sandboxGeschosseLayer = new Layer({
  name: "ch.sbb.geschosse",
  visible: true,
  properties: {
    hideInLayerTree: true,
  },
});

sandboxGeschosseLayer.children = geschosseLayer.children.map((layer) => {
  return layer.clone({
    mapboxLayer: sandboxDataLayer,
    properties: {
      parent: sandboxGeschosseLayer,
      hideInLayerTree: true,
      baselayers: [sandboxNetzkarteLayer, poiLayer],
    },
  });
});

export default [
  sandboxDataLayer,
  sandboxNetzkarteLayer,
  poiLayer,
  sandboxGeschosseLayer,
];
