import { Layer } from "mobility-toolbox-js/ol";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import KilometrageLayer from "../../layers/KilometrageLayer";
import {
  INFRASTRUKTUR_LAYER_NAME,
  MapsGeneralFilter,
  MapsGeneralFilterValues,
  MapsInfraFilter,
  MapsInfraFilterValues,
} from "../../utils/constants";

// eslint-disable-next-line import/prefer-default-export
export const getInfrastrukturLayers = () => {
  const netzkarteEisenbahninfrastruktur = new TrafimageMapboxLayer({
    name: INFRASTRUKTUR_LAYER_NAME,
    visible: true,
    zIndex: -1,
    style: "basemap_infra_bright",
    properties: {
      isBaseLayer: true,
    },
    mapOptions: {
      preserveDrawingBuffer: true,
    },
  });

  const kilometrageLayer = new KilometrageLayer({
    mapboxLayer: netzkarteEisenbahninfrastruktur,
  });

  const betriebsRegionen = new MapboxStyleLayer({
    name: "ch.sbb.betriebsregionen",
    visible: false,
    mapboxLayer: netzkarteEisenbahninfrastruktur,
    styleLayersFilter: ({ metadata }) =>
      metadata?.[MapsGeneralFilter] ===
      MapsGeneralFilterValues.OPERATIONAL_REGIONS,
    properties: {
      isQueryable: true,
      hasInfos: true,
      useOverlay: true,
      popupComponent: "BetriebsRegionenPopup",
      layerInfoComponent: "BetriebsRegionenLayerInfo",
    },
  });

  const tochtergesellschaftenSBB = new MapboxStyleLayer({
    name: "ch.sbb.infrastruktur.tochtergesellschaften.group",
    visible: true,
    mapboxLayer: netzkarteEisenbahninfrastruktur,
    styleLayersFilter: ({ metadata }) =>
      metadata?.[MapsInfraFilter] === MapsInfraFilterValues.SBB,
    properties: {
      hasInfos: true,
      description: "ch.sbb.infrastruktur.tochtergesellschaften.group-desc",
    },
  });

  const gewässer = new MapboxStyleLayer({
    name: "ch.sbb.infrastruktur.gewaesser.group",
    visible: true,
    mapboxLayer: netzkarteEisenbahninfrastruktur,
    styleLayersFilter: ({ metadata }) =>
      metadata?.[MapsGeneralFilter] === MapsGeneralFilterValues.WATERS,
    properties: {
      hasInfos: true,
      description: "ch.sbb.infrastruktur.gewaesser.group-desc",
    },
  });

  const uebrigeBahnen = new MapboxStyleLayer({
    name: "ch.sbb.infrastruktur.uebrigebahnen.group",
    visible: true,
    mapboxLayer: netzkarteEisenbahninfrastruktur,
    styleLayersFilter: ({ metadata }) =>
      metadata?.[MapsInfraFilter] === MapsInfraFilterValues.KTU,
    properties: {
      hasInfos: true,
      description: "ch.sbb.infrastruktur.uebrigebahnen.group-desc",
    },
  });

  const grenzen = new Layer({
    name: "ch.sbb.infrastruktur.grenzen.group",
    visible: false,
    properties: {
      hasInfos: true,
      description: "ch.sbb.infrastruktur.grenzen.group",
    },
    children: [
      new Layer({
        name: "ch.sbb.infrastruktur.gemeindegrenzen.group",
        visible: false,
        properties: {
          hasInfos: true,
          description: "ch.sbb.infrastruktur.gemeindegrenzen.group-desc",
        },
        children: [
          new MapboxStyleLayer({
            name: "ch.sbb.infrastruktur.gemeindegrenzen.greengrenzen",
            visible: false,
            isQueryable: false,
            mapboxLayer: netzkarteEisenbahninfrastruktur,
            styleLayersFilter: ({ metadata }) =>
              metadata?.[MapsGeneralFilter] ===
              MapsGeneralFilterValues.BORDER_MUNICIPALITY_GREEN,
            group: "ch.sbb.infrastruktur.gemeindegrenzen.group",
            properties: {
              hasInfos: true,
              description: "ch.sbb.infrastruktur.gemeindegrenzen.greengrenzen",
            },
          }),
          new MapboxStyleLayer({
            name: "ch.sbb.infrastruktur.gemeindegrenzen.greygrenzen",
            visible: false,
            isQueryable: false,
            mapboxLayer: netzkarteEisenbahninfrastruktur,
            styleLayersFilter: ({ metadata }) =>
              metadata?.[MapsGeneralFilter] ===
              MapsGeneralFilterValues.BORDER_MUNICIPALITY_GREY,
            group: "ch.sbb.infrastruktur.gemeindegrenzen.group",
            properties: {
              hasInfos: true,
              description: "ch.sbb.infrastruktur.gemeindegrenzen.greygrenzen",
            },
          }),
        ],
      }),
      new Layer({
        name: "ch.sbb.infrastruktur.kantonsgrenzen.group",
        visible: false,
        properties: {
          hasInfos: true,
          description: "ch.sbb.infrastruktur.kantonsgrenzen.group-desc",
        },
        children: [
          new MapboxStyleLayer({
            name: "ch.sbb.infrastruktur.kantonsgrenzen.greengrenzen",
            visible: false,
            mapboxLayer: netzkarteEisenbahninfrastruktur,
            styleLayersFilter: ({ metadata }) =>
              metadata?.[MapsGeneralFilter] ===
              MapsGeneralFilterValues.BORDER_CANTON_GREEN,
            group: "ch.sbb.infrastruktur.kantonsgrenzen.group",
            properties: {
              hasInfos: true,
              description: "ch.sbb.infrastruktur.kantonsgrenzen.greengrenzen",
            },
          }),
          new MapboxStyleLayer({
            name: "ch.sbb.infrastruktur.kantonsgrenzen.greygrenzen",
            visible: false,
            mapboxLayer: netzkarteEisenbahninfrastruktur,
            styleLayersFilter: ({ metadata }) =>
              metadata?.[MapsGeneralFilter] ===
              MapsGeneralFilterValues.BORDER_CANTON_GREY,
            group: "ch.sbb.infrastruktur.kantonsgrenzen.group",
            properties: {
              hasInfos: true,
              description: "ch.sbb.infrastruktur.kantonsgrenzen.greygrenzen",
            },
          }),
        ],
      }),
    ],
  });

  return [
    netzkarteEisenbahninfrastruktur,
    uebrigeBahnen,
    tochtergesellschaftenSBB,
    grenzen,
    gewässer,
    betriebsRegionen,
    kilometrageLayer,
  ];
};
