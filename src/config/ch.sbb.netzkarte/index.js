import { Layer } from "mobility-toolbox-js/ol";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import StationsLayer from "../../layers/StationsLayer";
import PlatformsLayer from "../../layers/PlatformsLayer";
import TralisLayer from "../../layers/TralisLayer";
import { LevelLayer } from "../../layers";
import { FLOOR_LEVELS } from "../../utils/constants";

export const dataLayer = new TrafimageMapboxLayer({
  name: "ch.sbb.netzkarte.data",
  visible: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: "base_bright_v2_ch.sbb.netzkarte",
  properties: {
    hideInLegend: true,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const netzkarteLayer = new MapboxStyleLayer({
  name: "ch.sbb.netzkarte.layer",
  key: "ch.sbb.netzkarte",
  group: "baseLayer",
  properties: {
    isBaseLayer: true,
    previewImage: "ch.sbb.netzkarte",
    hasLevels: true,
    hideInLegend: true,
  },
  visible: true,
  mapboxLayer: dataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "perimeter_mask",
  style: "base_bright_v2_ch.sbb.netzkarte",
});

export const netzkarteNight = new MapboxStyleLayer({
  name: "ch.sbb.netzkarte.dark",
  key: "ch.sbb.netzkarte.dark",
  group: "baseLayer",
  properties: {
    isBaseLayer: true,
    previewImage: "ch.sbb.netzkarte.dark",
    hasLevels: true,
    hideInLegend: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: "base_dark_v2_ch.sbb.netzkarte",
});

export const netzkarteAerial = new MapboxStyleLayer({
  name: "ch.sbb.netzkarte.luftbild.group",
  key: "ch.sbb.netzkarte.luftbild.group",
  group: "baseLayer",
  properties: {
    isBaseLayer: true,
    previewImage: "ch.sbb.netzkarte.luftbild.group",
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: "aerial_sbb_sbbkey_ch.sbb.netzkarte.aerial",
});

export const swisstopoSwissImage = new MapboxStyleLayer({
  name: "ch.sbb.netzkarte.luftbild.group",
  key: "ch.sbb.netzkarte.luftbild.group.old",
  group: "baseLayer",
  properties: {
    isBaseLayer: true,
    previewImage: "ch.sbb.netzkarte.luftbild.group",
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: "ch.swisstopo.backgrounds_ch.sbb.netzkarte.swisstopo",
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "swissimage",
});

export const swisstopoLandeskarte = new MapboxStyleLayer({
  name: "ch.sbb.netzkarte.landeskarte",
  key: "ch.sbb.netzkarte.landeskarte",
  group: "baseLayer",
  properties: {
    isBaseLayer: true,
    previewImage: "ch.sbb.netzkarte.landeskarte",
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: "ch.swisstopo.backgrounds_ch.sbb.netzkarte.swisstopo",
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "pixelkarte_farbe",
});

export const swisstopoLandeskarteGrau = new MapboxStyleLayer({
  name: "ch.sbb.netzkarte.landeskarte.grau",
  key: "ch.sbb.netzkarte.landeskarte.grau",
  group: "baseLayer",
  properties: {
    isBaseLayer: true,
    previewImage: "ch.sbb.netzkarte.landeskarte.grau",
  },
  visible: false,
  mapboxLayer: dataLayer,
  style: "ch.swisstopo.backgrounds_ch.sbb.netzkarte.swisstopo",
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "pixelkarte_grau",
});

export const passagierfrequenzen = new MapboxStyleLayer({
  name: "ch.sbb.bahnhoffrequenzen",
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "passagier_freq",
  properties: {
    isQueryable: true,
    hasInfos: true,
    layerInfoComponent: "PassagierFrequenzenLayerInfo",
    popupComponent: "PassagierFrequenzenPopup",
    useOverlay: true,
    dataLink: "https://reporting.sbb.ch/bahnhoefe",
    dataLinkPortalName: "Statistikportal",
  },
});

const interactivePlans = new MapboxStyleLayer({
  name: "ch.sbb.bahnhofplaene.interaktiv",
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "interaktiv",
  group: "bahnhofplaene",
  properties: {
    isQueryable: true,
    hasInfos: true,
    description: "ch.sbb.bahnhofplaene.interaktiv-desc",
    popupComponent: "StationPopup",
    useOverlay: true,
  },
});
const printPlans = new MapboxStyleLayer({
  name: "ch.sbb.bahnhofplaene.printprodukte",
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "printprodukte",
  group: "bahnhofplaene",
  properties: {
    isQueryable: true,
    hasInfos: true,
    description: "ch.sbb.bahnhofplaene.printprodukte-desc",
    popupComponent: "StationPopup",
    useOverlay: true,
  },
});

export const bahnhofplaene = new Layer({
  name: "ch.sbb.bahnhofplaene",
  visible: false,
  children: [interactivePlans.clone(), printPlans.clone()],
  properties: {
    hasInfos: true,
    description: "ch.sbb.bahnhofplaene-desc",
    dataLink:
      "https://data.sbb.ch/explore/dataset/haltestelle-karte-trafimage/information/",
    dataService: true,
  },
});

export const punctuality = new TralisLayer({
  name: "ch.sbb.puenktlichkeit",
  visible: false,
  properties: {
    hasAccessibility: true,
    hasInfos: true,
    layerInfoComponent: "PunctualityLayerInfo",
  },
});

// if a permalink parameter is defined (see TralisLayer), we don't display children.
if (!punctuality.permalinkFilter) {
  punctuality.children = [
    new Layer({
      name: "ch.sbb.puenktlichkeit-gondola",
      visible: false,
      properties: {
        mots: ["gondola"],
      },
    }),
    new Layer({
      name: "ch.sbb.puenktlichkeit-funicular",
      visible: false,
      properties: {
        mots: ["funicular", "cablecar"],
      },
    }),
    new Layer({
      name: "ch.sbb.puenktlichkeit-ferry",
      visible: false,
      properties: {
        mots: ["ferry"],
      },
    }),
    new Layer({
      name: "ch.sbb.puenktlichkeit-bus",
      visible: false,
      properties: {
        mots: ["bus"],
      },
    }),
    new Layer({
      name: "ch.sbb.puenktlichkeit-tram",
      visible: false,
      properties: {
        mots: ["tram", "subway"],
      },
    }),
    new Layer({
      name: "ch.sbb.puenktlichkeit-nv",
      visible: false,
      properties: {
        filter: ({ properties }) => {
          const { type, line } = properties;
          return type === "rail" && !/(IR|IC|EC|RJX|TGV)/.test(line?.name);
        },
      },
    }),
    new Layer({
      name: "ch.sbb.puenktlichkeit-fv",
      visible: false,
      properties: {
        filter: ({ properties }) => {
          const { type, line } = properties;
          return type === "rail" && /(IR|IC|EC|RJX|TGV)/.test(line?.name);
        },
      },
    }),
  ];
  punctuality.children.forEach((layer) => {
    layer.on("change:visible", () => {
      let mots = [];
      let filters = [];
      punctuality.children.forEach((child) => {
        if (child.visible) {
          if (child.get("mots")) {
            mots = mots.concat(child.get("mots"));
          }
          if (child.get("filter")) {
            filters.push(child.get("filter"));
          }
        }
      });
      filters = [
        (trajectory) => {
          return mots.includes(trajectory.properties.type);
        },
        ...filters,
      ];
      punctuality.filter = (trajectory) => {
        return filters.find((filterFunc) => filterFunc(trajectory));
      };
      punctuality.renderTrajectories();
    });
  });
}

export const stationsLayer = new StationsLayer({
  name: "ch.sbb.netzkarte.stationen",
  mapboxLayer: dataLayer,
});

export const platformsLayer = new PlatformsLayer({
  name: "ch.sbb.netzkarte.platforms",
  mapboxLayer: dataLayer,
});

export const buslines = new MapboxStyleLayer({
  name: "ch.sbb.netzkarte.buslinien",
  mapboxLayer: dataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata["trafimage.filter"] === "bus",
  visible: false,
  properties: {
    isQueryable: (map) => {
      return map.getView().getZoom() >= 15;
    },
    hasInfos: true,
    layerInfoComponent: "BuslinesLayerInfo",
    popupComponent: "BusLinePopup",
    useOverlay: true,
  },
});

buslines.on("change:visible", () => {
  dataLayer.mbMap?.once("idle", () => stationsLayer.updateSource());
});

export const gemeindegrenzen = new MapboxStyleLayer({
  name: "ch.sbb.ch_gemeinden",
  mapboxLayer: dataLayer,
  visible: false,
  styleLayersFilter: ({ metadata }) =>
    metadata && metadata["trafimage.filter"] === "municipality_borders",
  properties: {
    hasInfos: true,
    description: "ch.sbb.ch_gemeinden-desc",
  },
});

export const geschosseLayer = new Layer({
  name: "ch.sbb.geschosse",
  visible: true,
  properties: {
    hideInLayerTree: true,
  },
});

geschosseLayer.children = FLOOR_LEVELS.map((level) => {
  return new LevelLayer({
    name: `ch.sbb.geschosse${level}`,
    visible: level === "2D",
    mapboxLayer: dataLayer,
    styleLayersFilter: ({ metadata }) => metadata && metadata["geops.filter"],
    level,
    group: "ch.sbb.geschosse-layer",
    properties: {
      parent: geschosseLayer,
      hideInLayerTree: true,
    },
  });
});

export const defaultBaseLayers = [
  dataLayer,
  netzkarteLayer,
  netzkarteNight,
  netzkarteAerial,
  swisstopoLandeskarte,
  swisstopoLandeskarteGrau,
];

export default [
  ...defaultBaseLayers,
  punctuality,
  stationsLayer,
  platformsLayer,
  passagierfrequenzen,
  gemeindegrenzen,
  buslines,
  bahnhofplaene.clone({
    children: [interactivePlans.clone(), printPlans.clone()], // There is a bug in MTJS that breaks the radio buttons, so we need to clone the layers.
  }),
  geschosseLayer,
];
