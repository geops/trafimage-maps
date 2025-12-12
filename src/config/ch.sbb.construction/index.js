import { Layer } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import AusbauLayer from "../../layers/AusbauLayer";
import { getNetzkarteLayers } from "../ch.sbb.netzkarte";
import {
  NETZKARTE_AERIAL_LAYER_NAME,
  NETZKARTE_LAYER_NAME,
} from "../../utils/constants";

// eslint-disable-next-line import/prefer-default-export
export const getConstructionLayers = () => {
  const layers = getNetzkarteLayers();

  const netzkarteLayer = layers.find((l) => l.name === NETZKARTE_LAYER_NAME);

  const netzkarteAerial = layers.find(
    (l) => l.name === NETZKARTE_AERIAL_LAYER_NAME,
  );

  const constructionDataLayer = new TrafimageMapboxLayer({
    name: "ch.sbb.construction.data",
    visible: true,
    zIndex: -1,
    style: "base_bright_v2_ch.sbb.bauprojekte",
    properties: {
      hideInLegend: true,
      isBaseLayer: false,
    },
    mapOptions: {
      preserveDrawingBuffer: true,
    },
  });

  const constrAusbau = new AusbauLayer({
    name: "ch.sbb.construction.ausbau.group",
    desc: "ch.sbb.construction.ausbau.group-desc",
    visible: true,
    mapboxLayer: constructionDataLayer,
    properties: {
      hasInfos: true,
      description: "ch.sbb.construction.ausbau.group-desc",
      filtersComponent: "AusbauFilters",
    },
    children: [
      new MapboxStyleLayer({
        name: "ch.sbb.construction.ausbau.uebrige",
        key: "ch.sbb.construction.ausbau.uebrige",
        visible: true,
        mapboxLayer: constructionDataLayer,
        styleLayersFilter: ({ metadata }) =>
          !!metadata && metadata["trafimage.filter"] === "ausbau.uebrige",
        properties: {
          isQueryable: true,
          hasInfos: true,
          layerInfoComponent: "ConstructionLayerInfo",
          useOverlay: true,
          popupComponent: "ConstructionPopup",
          construction: {
            art: "Ausbau",
            ort: "Übrige Standorte",
          },
        },
      }),
      new MapboxStyleLayer({
        name: "ch.sbb.construction.ausbau.bahnhof_strecke",
        key: "ch.sbb.construction.ausbau.bahnhof_strecke",
        visible: true,
        mapboxLayer: constructionDataLayer,
        styleLayersFilter: ({ metadata }) =>
          !!metadata &&
          metadata["trafimage.filter"] === "ausbau.bahnhof_strecke",
        properties: {
          isQueryable: true,
          hasInfos: true,
          layerInfoComponent: "ConstructionLayerInfo",
          useOverlay: true,
          popupComponent: "ConstructionPopup",
          construction: {
            art: "Ausbau",
            ort: "Bahnhof und Strecke",
          },
        },
      }),
      new MapboxStyleLayer({
        name: "ch.sbb.construction.ausbau.strecke",
        key: "ch.sbb.construction.ausbau.strecke",
        visible: true,
        mapboxLayer: constructionDataLayer,
        styleLayersFilter: ({ metadata }) =>
          !!metadata && metadata["trafimage.filter"] === "ausbau.strecke",
        properties: {
          isQueryable: true,
          hasInfos: true,
          layerInfoComponent: "ConstructionLayerInfo",
          useOverlay: true,
          popupComponent: "ConstructionPopup",
          construction: {
            art: "Ausbau",
            ort: "Strecke",
          },
        },
      }),
      new MapboxStyleLayer({
        name: "ch.sbb.construction.ausbau.bahnhof",
        key: "ch.sbb.construction.ausbau.bahnhof",
        visible: true,
        mapboxLayer: constructionDataLayer,
        styleLayersFilter: ({ metadata }) =>
          !!metadata && metadata["trafimage.filter"] === "ausbau.bahnhof",
        properties: {
          isQueryable: true,
          hasInfos: true,
          layerInfoComponent: "ConstructionLayerInfo",
          useOverlay: true,
          popupComponent: "ConstructionPopup",
          construction: {
            art: "Ausbau",
            ort: "Bahnhof",
          },
        },
      }),
    ],
  });

  const constrUnterhalt = new Layer({
    name: "ch.sbb.construction.unterhalt.group",
    desc: "ch.sbb.construction.unterhalt.group-desc",
    visible: true,
    properties: {
      hasInfos: true,
      description: "ch.sbb.construction.unterhalt.group-desc",
    },
    children: [
      new MapboxStyleLayer({
        name: "ch.sbb.construction.unterhalt.uebrige",
        key: "ch.sbb.construction.unterhalt.uebrige",
        visible: true,
        mapboxLayer: constructionDataLayer,
        styleLayersFilter: ({ metadata }) =>
          !!metadata && metadata["trafimage.filter"] === "unterhalt.uebrige",
        properties: {
          hasInfos: true,
          isQueryable: true,
          layerInfoComponent: "ConstructionLayerInfo",
          useOverlay: true,
          popupComponent: "ConstructionPopup",
          construction: {
            art: "Unterhalt",
            ort: "Übrige Standorte",
          },
        },
      }),
      new MapboxStyleLayer({
        name: "ch.sbb.construction.unterhalt.bahnhof_strecke",
        key: "ch.sbb.construction.unterhalt.bahnhof_strecke",
        visible: true,
        mapboxLayer: constructionDataLayer,
        styleLayersFilter: ({ metadata }) =>
          !!metadata &&
          metadata["trafimage.filter"] === "unterhalt.bahnhof_strecke",
        properties: {
          hasInfos: true,
          isQueryable: true,
          layerInfoComponent: "ConstructionLayerInfo",
          useOverlay: true,
          popupComponent: "ConstructionPopup",
          construction: {
            art: "Unterhalt",
            ort: "Bahnhof und Strecke",
          },
        },
      }),
      new MapboxStyleLayer({
        name: "ch.sbb.construction.unterhalt.strecke",
        key: "ch.sbb.construction.unterhalt.strecke",
        visible: true,
        mapboxLayer: constructionDataLayer,
        styleLayersFilter: ({ metadata }) =>
          !!metadata && metadata["trafimage.filter"] === "unterhalt.strecke",
        properties: {
          hasInfos: true,
          isQueryable: true,
          layerInfoComponent: "ConstructionLayerInfo",
          useOverlay: true,
          popupComponent: "ConstructionPopup",
          construction: {
            art: "Unterhalt",
            ort: "Strecke",
          },
        },
      }),
      new MapboxStyleLayer({
        name: "ch.sbb.construction.unterhalt.bahnhof",
        key: "ch.sbb.construction.unterhalt.bahnhof",
        visible: true,
        mapboxLayer: constructionDataLayer,
        styleLayersFilter: ({ metadata }) =>
          !!metadata && metadata["trafimage.filter"] === "unterhalt.bahnhof",
        properties: {
          hasInfos: true,
          isQueryable: true,
          layerInfoComponent: "ConstructionLayerInfo",
          useOverlay: true,
          popupComponent: "ConstructionPopup",
          construction: {
            art: "Unterhalt",
            ort: "Bahnhof",
          },
        },
      }),
    ],
  });

  let constrLayers = [];

  const updateConstructions = (mbMap) => {
    // Modifying the source triggers an idle state so we use "once" to avoid an infinite loop.
    mbMap.once("idle", () => {
      const constrRendered = mbMap
        .queryRenderedFeatures({
          layers: constrLayers,
        })
        .map((feat) => {
          const good = {
            id: feat.id * 1000,
            type: feat.type,
            properties: feat.properties,
            geometry: feat.geometry,
          };
          return good;
        });
      const source = mbMap.getSource("clusters");
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: constrRendered,
        });
      }
    });
  };

  const constrOlListenersKeys = [];
  constructionDataLayer.on("load", () => {
    const { map, mbMap } = constructionDataLayer;
    constrLayers = mbMap
      .getStyle()
      .layers.filter(({ metadata }) => {
        return (
          metadata && /(ausbau|unterhalt)/.test(metadata["trafimage.filter"])
        );
      })
      .map((layer) => layer.id);

    updateConstructions(mbMap);

    // Update clusters source on moveeend.
    unByKey(constrOlListenersKeys);

    constrOlListenersKeys.push(
      map.on("moveend", () => {
        // [constrAusbau, constrUnterhalt].forEach((layer) => {
        //   // eslint-disable-next-line no-param-reassign
        //   layer.isQueryable = map.getView().getZoom() > 10;
        // });
        updateConstructions(mbMap);
      }),
    );
  });

  // Re-render cluster when change construction layers visiblity.
  [constrAusbau, constrUnterhalt].forEach((parentLayer) => {
    parentLayer.children.forEach((l) => {
      l.on("change:visible", ({ target: layer }) => {
        // Re-render only for children that contribute to the cluster
        if (
          layer.mapboxLayer &&
          constructionDataLayer &&
          constructionDataLayer.mbMap
        ) {
          updateConstructions(layer.mapboxLayer.mbMap);
        }
      });
    });
  });

  const constrClusters = new MapboxStyleLayer({
    name: "ch.sbb.construction-cluster",
    key: "ch.sbb.construction-cluster",
    visible: true,
    mapboxLayer: constructionDataLayer,
    properties: {
      isQueryable: true,
      useOverlay: true,
      popupComponent: "ConstructionPopup",
      hideInLegend: true,
      cluster: true,
    },
    styleLayersFilter: ({ metadata }) => {
      return (
        !!metadata && /bauprojekte\.cluster/.test(metadata["trafimage.filter"])
      );
    },
    queryRenderedLayersFilter: ({ metadata }) => {
      return (
        !!metadata &&
        metadata["trafimage.filter"] === "bauprojekte.cluster.circle"
      );
    },
  });

  return [
    constructionDataLayer,
    netzkarteLayer.clone({
      mapboxLayer: constructionDataLayer,
      style: "base_bright_v2_ch.sbb.bauprojekte",
    }),
    netzkarteAerial.clone({
      mapboxLayer: constructionDataLayer,
      style: "aerial_sbb_sbbkey_ch.sbb.bauprojekte",
    }),
    constrUnterhalt,
    constrAusbau,
    constrClusters,
  ];
};
