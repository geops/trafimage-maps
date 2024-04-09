import { Layer } from "mobility-toolbox-js/ol";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import LevelLayer from "../../layers/LevelLayer";
import { dataLayer, netzkarteLayer } from "../ch.sbb.netzkarte";

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

export const geschosseLayer = new Layer({
  name: "ch.sbb.geschosse",
  visible: true,
});

geschosseLayer.children = [-4, -3, -2, -1, 0, "2D", 1, 2, 3, 4].map((level) => {
  return new LevelLayer({
    name: `ch.sbb.geschosse${level}`,
    visible: level === "2D",
    mapboxLayer: sandboxDataLayer,
    styleLayersFilter: ({ metadata }) => metadata && metadata["geops.filter"],
    level,
    group: "ch.sbb.geschosse-layer",
    properties: {
      parent: geschosseLayer,
    },
  });
});

export default [
  sandboxDataLayer,
  sandboxNetzkarteLayer,
  poiLayer,
  geschosseLayer,
];
