import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import { FORCE_EXPORT_PROPERTY } from "../../utils/constants";

// eslint-disable-next-line import/prefer-default-export
export const getEnergieLayers = () => {
  const energieDataLayer = new TrafimageMapboxLayer({
    name: "ch.sbb.energie.public.data",
    zIndex: -1,
    style: "netzkarte_eisenbahninfrastruktur_v3_ch.sbb.energie.public",
    properties: {
      hideInLegend: true,
      isBaseLayer: true,
    },
    mapOptions: {
      preserveDrawingBuffer: true,
    },
  });

  const energieLeitungenLayer = new MapboxStyleLayer({
    name: "ch.sbb.energie.public.leitungen",
    mapboxLayer: energieDataLayer,
    queryRenderedLayersFilter: ({ metadata }) =>
      metadata && /^leitung$/.test(metadata["energie.filter"]),
    styleLayersFilter: ({ metadata }) =>
      metadata &&
      /^(leitung|leitung.label|leitung.label.lc)$/.test(
        metadata["energie.filter"],
      ),
    properties: {
      isQueryable: true,
      hasInfos: true,
      layerInfoComponent: "EnergieLayerInfo",
      popupComponent: "EnergiePopup",
      useOverlay: true,
      [FORCE_EXPORT_PROPERTY]: true,
    },
  });

  const energieUnterwerkeLayer = new MapboxStyleLayer({
    name: "ch.sbb.energie.public.unterwerke",
    mapboxLayer: energieDataLayer,
    queryRenderedLayersFilter: ({ metadata }) =>
      metadata && /^anlagen.uw.icon$/.test(metadata["energie.filter"]),
    styleLayersFilter: ({ metadata }) =>
      metadata && /^anlagen.uw/.test(metadata["energie.filter"]),
    properties: {
      isQueryable: true,
      hasInfos: true,
      layerInfoComponent: "EnergieLayerInfo",
      popupComponent: "EnergiePopup",
      useOverlay: true,
      [FORCE_EXPORT_PROPERTY]: true,
    },
  });

  return [energieDataLayer, energieLeitungenLayer, energieUnterwerkeLayer];
};
