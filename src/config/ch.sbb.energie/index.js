import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import {
  FORCE_EXPORT_PROPERTY,
  MapsEnergieFilter,
  MapsEnergieFilterValues,
} from "../../utils/constants";

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
      metadata?.[MapsEnergieFilter] === MapsEnergieFilterValues.LEITUNG,
    styleLayersFilter: ({ metadata }) =>
      [
        MapsEnergieFilterValues.LEITUNG,
        MapsEnergieFilterValues.LEITUNG_LABEL,
        MapsEnergieFilterValues.LEITUNG_LABEL_LC,
      ].includes(metadata?.[MapsEnergieFilter]),
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
      metadata?.[MapsEnergieFilter] === MapsEnergieFilterValues.ANLAGEN_UW_ICON,
    styleLayersFilter: ({ metadata }) =>
      [
        MapsEnergieFilterValues.ANLAGEN_UW_ICON,
        MapsEnergieFilterValues.ANLAGEN_UW_LABEL,
      ].includes(metadata?.[MapsEnergieFilter]),
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
