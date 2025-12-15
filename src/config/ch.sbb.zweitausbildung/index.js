import { Layer } from "mobility-toolbox-js/ol";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import ZweitausbildungAbroadLayer from "../../layers/ZweitausbildungAbroadLayer";
import ZweitausbildungPoisLayer from "../../layers/ZweitausbildungPoisLayer";
import ZweitausbildungRoutesLayer from "../../layers/ZweitausbildungRoutesLayer";
import ZweitausbildungRoutesHighlightLayer from "../../layers/ZweitausbildungRoutesHighlightLayer";

// eslint-disable-next-line import/prefer-default-export
export const getZweitausbildungLayers = () => {
  const zweitausbildungDataLayer = new TrafimageMapboxLayer({
    name: "ch.sbb.zweitausbildung",
    visible: true,
    zIndex: -1,
    style: "base_bright_v2_ch.sbb.zweitausbildung",
    properties: {
      hideInLegend: true,
    },
    mapOptions: {
      preserveDrawingBuffer: true,
    },
  });

  const zweitausbildungAbroad = new ZweitausbildungAbroadLayer({
    name: "ch.sbb.zweitausbildung.abroad",
    key: "ch.sbb.zweitausbildung.abroad",
    visible: true,
    zIndex: 2,
    properties: {
      isQueryable: true,
      popupComponent: "ZweitausbildungAbroadPopup",
      hasInfos: true,
      layerInfoComponent: "ZweitausbildungLayerInfo",
      zweitausbildung: {
        infos: {
          title: "ch.sbb.zweitausbildung.abroad-title",
          legend: {
            image: "button_rectangle.png",
            name: "ch.sbb.zweitausbildung.abroad-name",
          },
        },
      },
    },
  });

  const zweitausbildungStations = new Layer({
    name: "ch.sbb.zweitausbildung.stationen.group",
    visible: true,
    properties: {
      hasInfos: true,
      layerInfoComponent: "ZweitausbildungLayerInfo",
      zweitausbildung: {
        infos: {
          title: "ch.sbb.zweitausbildung.stationen.group-title",
        },
      },
    },
    children: [
      new MapboxStyleLayer({
        name: "ch.sbb.zweitausbildung.haltestellen.aufbau",
        zIndex: 3,
        mapboxLayer: zweitausbildungDataLayer,
        styleLayersFilter: ({ metadata }) =>
          !!metadata && /stations\.aufbau/.test(metadata["trafimage.filter"]),
        properties: {
          hasInfos: true,
          layerInfoComponent: "ZweitausbildungSubLayerInfo",
          zweitausbildung: {
            infos: {
              title: "ch.sbb.zweitausbildung.haltestellen.aufbau-title",
              legend: [
                {
                  image: "station_aufbau.png",
                  name: "ch.sbb.zweitausbildung.haltestellen-stations",
                },
                {
                  image: "station_aufbau_grenzstation.png",
                  name: "ch.sbb.zweitausbildung.haltestellen-border-stations",
                },
              ],
            },
          },
        },
      }),
      new MapboxStyleLayer({
        name: "ch.sbb.zweitausbildung.haltestellen.basis",
        zIndex: 3,
        mapboxLayer: zweitausbildungDataLayer,
        styleLayersFilter: ({ metadata }) =>
          !!metadata && /stations\.basis/.test(metadata["trafimage.filter"]),
        properties: {
          hasInfos: true,
          layerInfoComponent: "ZweitausbildungSubLayerInfo",
          zweitausbildung: {
            infos: {
              title: "ch.sbb.zweitausbildung.haltestellen.basis-title",
              legend: [
                {
                  image: "station_basis.png",
                  name: "ch.sbb.zweitausbildung.haltestellen-stations",
                },
                {
                  image: "station_basis_grenzstation.png",
                  name: "ch.sbb.zweitausbildung.haltestellen-border-stations",
                },
              ],
            },
          },
        },
      }),
    ],
  });

  const zweitausbildungPois = new Layer({
    name: "ch.sbb.zweitausbildung.tourist.pois.group",
    visible: true,
    properties: {
      hasInfos: true,
      layerInfoComponent: "ZweitausbildungLayerInfo",
      zweitausbildung: {
        infos: {
          title: "ch.sbb.zweitausbildung.tourist.pois.group-title",
        },
      },
    },
    children: [
      new ZweitausbildungPoisLayer({
        name: "ch.sbb.zweitausbildung.tourist.pois.no_railaway",
        key: "ch.sbb.zweitausbildung.tourist.pois.no_railaway",
        visible: true,
        zIndex: 4,
        mapboxLayer: zweitausbildungDataLayer,
        styleLayersFilter: ({ metadata }) => {
          return (
            !!metadata &&
            /(clusters|noclusters)\.no_railaway/.test(
              metadata["trafimage.filter"],
            )
          );
        },
        properties: {
          isQueryable: true,
          useOverlay: true,
          popupComponent: "ZweitausbildungPoisPopup",
          hasInfos: true,
          layerInfoComponent: "ZweitausbildungSubLayerInfo",
          zweitausbildung: {
            sourceId: "clusters.no_railaway",
            filter: ["==", "rail_away", false],
            infos: {
              legend: [
                {
                  image: "poi_no_railaway.png",
                  name: "ch.sbb.zweitausbildung.tourist.pois.no_railaway-name",
                },
              ],
            },
          },
        },
      }),
      new ZweitausbildungPoisLayer({
        name: "ch.sbb.zweitausbildung.tourist.pois.railaway",
        key: "ch.sbb.zweitausbildung.tourist.pois.railaway",
        visible: true,
        zIndex: 4,
        mapboxLayer: zweitausbildungDataLayer,
        styleLayersFilter: ({ metadata }) => {
          return (
            !!metadata &&
            /(clusters|noclusters)\.railaway/.test(metadata["trafimage.filter"])
          );
        },
        properties: {
          isQueryable: true,
          useOverlay: true,
          popupComponent: "ZweitausbildungPoisPopup",
          hasInfos: true,
          layerInfoComponent: "ZweitausbildungSubLayerInfo",
          zweitausbildung: {
            sourceId: "clusters.railaway",
            filter: ["==", "rail_away", true],
            infos: {
              legend: [
                {
                  image: "poi_railaway.png",
                  name: "ch.sbb.zweitausbildung.tourist.pois.railaway-name",
                },
              ],
            },
          },
        },
      }),
    ],
  });

  const zweitausbildungRoutes = new Layer({
    name: "ch.sbb.zweitausbildung.linien.group",
    visible: true,
    properties: {
      hasInfos: true,
      layerInfoComponent: "ZweitausbildungLayerInfo",
      zweitausbildung: {
        infos: {
          title: "ch.sbb.zweitausbildung.linien.group-title",
        },
      },
    },
    children: [
      new ZweitausbildungRoutesLayer({
        name: "ch.sbb.zweitausbildung.tourist.routes.group",
        key: "ch.sbb.zweitausbildung.tourist.routes.group",
        visible: false,
        mapboxLayer: zweitausbildungDataLayer,
        group: "zweitausbildungRoutes",
        properties: {
          isAlwaysExpanded: true,
          hasInfos: true,
          layerInfoComponent: "ZweitausbildungRoutesSubLayerInfo",
          zweitausbildung: {
            property: "touristische_linie",
            infos: {
              title: "ch.sbb.zweitausbildung.tourist.routes.group",
              desc: "ch.sbb.zweitausbildung.tourist.routes.group-desc",
              legend: {
                image: "legend_tourist_strecken.png",
              },
            },
            layer: "zweitausbildung_tourist_strecken_grouped_qry",
          },
        },
        children: [
          new ZweitausbildungRoutesHighlightLayer({
            name: "ch.sbb.zweitausbildung.tourist.routes.grouped",
            visible: false,
            zIndex: 1,
            mapboxLayer: zweitausbildungDataLayer,
            properties: {
              isQueryable: true,
              useOverlay: true,
              popupComponent: "ZweitausbildungRoutesPopup",
              zweitausbildung: {
                property: "touristische_linie",
                layer: "zweitausbildung_tourist_strecken",
                featureInfoLayer: "zweitausbildung_tourist_strecken_qry_xyr",
              },
            },
          }),
        ],
      }),
      new ZweitausbildungRoutesLayer({
        name: "ch.sbb.zweitausbildung.hauptlinien.group",
        visible: true,
        mapboxLayer: zweitausbildungDataLayer,
        group: "zweitausbildungRoutes",
        properties: {
          isAlwaysExpanded: true,
          hasInfos: true,
          layerInfoComponent: "ZweitausbildungRoutesSubLayerInfo",
          zweitausbildung: {
            property: "hauptlinie",
            infos: {
              title: "ch.sbb.zweitausbildung.hauptlinien.group",
              desc: "ch.sbb.zweitausbildung.hauptlinien.group-desc",
              legend: {
                image: "legend_hauptlinien.svg",
              },
            },
            layer: "zweitausbildung_hauptlinien_grouped_qry",
          },
        },
        children: [
          new ZweitausbildungRoutesHighlightLayer({
            name: "ch.sbb.zweitausbildung.hauptlinien.grouped",
            visible: true,
            zIndex: 1,
            mapboxLayer: zweitausbildungDataLayer,
            properties: {
              isQueryable: true,
              useOverlay: true,
              popupComponent: "ZweitausbildungRoutesPopup",
              zweitausbildung: {
                property: "hauptlinie",
                layer: "zweitausbildung_hauptlinien",
                featureInfoLayer: "zweitausbildung_hauptlinien_qry_xyr",
              },
            },
          }),
        ],
      }),
    ],
  });

  return [
    zweitausbildungDataLayer,
    zweitausbildungAbroad,
    zweitausbildungPois,
    zweitausbildungRoutes,
    zweitausbildungStations,
  ];
};
