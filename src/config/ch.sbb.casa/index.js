import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import StationsLayer from "../../layers/StationsLayer";
import { getNetzkarteLayers } from "../ch.sbb.netzkarte";
import {
  DATA_LAYER_NAME,
  NETZKARTE_AERIAL_LAYER_NAME,
  NETZKARTE_LAYER_NAME,
} from "../../utils/constants";

// eslint-disable-next-line import/prefer-default-export
export const getCasaLayers = () => {
  const layers = getNetzkarteLayers();
  const dataLayer = layers.find((l) => l.get("name") === DATA_LAYER_NAME);

  const netzkarteLayer = layers.find(
    (l) => l.get("name") === NETZKARTE_LAYER_NAME,
  );

  const netzkarteAerial = layers.find(
    (l) => l.get("name") === NETZKARTE_AERIAL_LAYER_NAME,
  );

  const casaDataLayerWithoutLabels = dataLayer.clone({
    filters: [
      {
        field: "type",
        value: /symbol|circle/,
        include: false,
      },
    ],
  });

  const casaNetzkarteLayerWithoutLabels = netzkarteLayer.clone({
    mapboxLayer: casaDataLayerWithoutLabels,
  });

  const casaNetzkarteAerial = netzkarteAerial.clone({
    mapboxLayer: casaDataLayerWithoutLabels,
  });

  const casaNetzkarteLayerWithLabels = new TrafimageMapboxLayer({
    name: "ch.sbb.netzkarte.labels",
    visible: true,
    style: "base_bright_v2",
    filters: [
      {
        field: "type",
        value: /symbol|circle/i,
        include: true,
      },
    ],
    zIndex: 2,
    properties: {
      hideInLegend: true,
      isQueryable: true,
    },
  });

  // Add stations (blue style on hover) to labelsDataLayer.
  const casaNetzkarteStationsLayer = new StationsLayer({
    name: "ch.sbb.netzkarte.stationen.casa",
    mapboxLayer: casaNetzkarteLayerWithLabels,
  });

  return [
    casaDataLayerWithoutLabels,
    casaNetzkarteLayerWithoutLabels,
    casaNetzkarteAerial,
    casaNetzkarteLayerWithLabels,
    casaNetzkarteStationsLayer,
  ];
};
