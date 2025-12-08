import { Layer } from "mobility-toolbox-js/ol";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import KilometrageLayer from "../../layers/KilometrageLayer";

// eslint-disable-next-line import/prefer-default-export
export const getInfrastrukturLayers = () => {
  const netzkarteEisenbahninfrastruktur = new TrafimageMapboxLayer({
    name: "ch.sbb.infrastruktur",
    visible: true,
    zIndex: -1,
    style: "netzkarte_eisenbahninfrastruktur_v3",
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
      /^operational_regions$/.test(metadata?.["general.filter"]),
    properties: {
      isQueryable: true,
      hasInfos: true,
      useOverlay: true,
      popupComponent: "BetriebsRegionenPopup",
      layerInfoComponent: "BetriebsRegionenLayerInfo",
    },
  });

  // Clone layer to set visibility true by default for appName="betriebsregionen" [TRAFDIV-421]
  // const betriebsRegionenVisible = new MapboxStyleLayer({
  //   name: "ch.sbb.betriebsregionen",
  //   visible: true,
  //   mapboxLayer: netzkarteEisenbahninfrastruktur,
  //   styleLayersFilter: ({ metadata }) =>
  //     /^operational_regions$/.test(metadata?.["general.filter"]),
  //   properties: {
  //     isQueryable: true,
  //     hasInfos: true,
  //     useOverlay: true,
  //     popupComponent: "BetriebsRegionenPopup",
  //     layerInfoComponent: "BetriebsRegionenLayerInfo",
  //   },
  // });

  const tochtergesellschaftenSBB = new MapboxStyleLayer({
    name: "ch.sbb.infrastruktur.tochtergesellschaften.group",
    visible: true,
    mapboxLayer: netzkarteEisenbahninfrastruktur,
    styleLayersFilter: ({ metadata }) =>
      /^sbb$/.test(metadata?.["infra.filter"]),
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
      /^waters$/.test(metadata?.["general.filter"]),
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
      /^ktu$/.test(metadata?.["infra.filter"]),
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
              /^border\.municipality\.green$/.test(
                metadata?.["general.filter"],
              ),
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
              /^border\.municipality\.grey$/.test(metadata?.["general.filter"]),
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
              /^border\.canton\.green$/.test(metadata?.["general.filter"]),
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
              /^border\.canton\.grey$/.test(metadata?.["general.filter"]),
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
