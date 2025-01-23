import { Layer } from "mobility-toolbox-js/ol";
import TrafimageMapboxLayer from "../../layers/TrafimageMapboxLayer";
import MapboxStyleLayer from "../../layers/MapboxStyleLayer";
import { KilometrageLayer } from "../../layers";
import RegionenkarteLayer from "../../layers/RegionenkarteLayer";

export const anlagenverantwortliche = new TrafimageMapboxLayer({
  name: "ch.sbb.anlagenverantwortliche",
  style: "netzkarte_eisenbahninfrastruktur_v3_ch.sbb.anlagenverantwortliche",
  visible: true,
  zIndex: -1,
  properties: {
    hideInLegend: true,
    isBaseLayer: false,
  },
  mapOptions: {
    preserveDrawingBuffer: true,
  },
});

export const regionenkartePublicSegment = new Layer({
  name: "ch.sbb.regionenkarte.intern.av_segmente.public",
  visible: true,
  properties: {
    hasInfos: true,
    layerInfoComponent: "RegionenkartePublicLayerInfo",
  },
  children: [
    new RegionenkarteLayer({
      name: "ch.sbb.regionenkarte.lines",
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /anlagenverantwortliche\.lines$/.test(id);
      },
      properties: {
        isQueryable: true,
        hideInLegend: true,
        useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
        popupComponent: "RegionenkarteSegmentPopup",
        featureInfoFilter: (feature) => {
          // There is some points in this data source and we don't want them.
          return (
            feature.getGeometry().getType() === "LineString" ||
            feature.getGeometry().getType() === "MultiLineString"
          );
        },
      },
    }),
    new MapboxStyleLayer({
      name: "ch.sbb.regionenkarte.stations",
      isQueryable: false,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /anlagenverantwortliche\.stations/.test(id);
      },
      properties: {
        hideInLegend: true,
      },
    }),
    new MapboxStyleLayer({
      name: "ch.sbb.regionenkarte.regionintersection",
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /anlagenverantwortliche\.regionintersection/.test(id);
      },
      properties: {
        hideInLegend: true,
        popupComponent: "RegionenkarteIntersectionPopup",
        isQueryable: true,
      },
    }),
  ],
});

export const regionenkarteOverlayGroup = new Layer({
  name: "ch.sbb.infrastruktur.overlay.group",
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    description: "ch.sbb.infrastruktur.overlay.group-desc",
  },
  children: [
    new MapboxStyleLayer({
      name: "ch.sbb.infrastruktur.betriebspunkte",
      visible: true,
      isQueryable: false,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        // We select all stations
        return /FanasStation/.test(id);
      },
      properties: {
        hasInfos: true,
        description: "ch.sbb.infrastruktur.betriebspunkte-desc",
      },
    }),
    new MapboxStyleLayer({
      name: "ch.sbb.infrastruktur.line_point",
      visible: true,
      isQueryable: false,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /FanasLine|DFA/.test(id);
      },
      properties: {
        hasInfos: true,
        description: "ch.sbb.infrastruktur.line_point-desc",
      },
    }),
  ],
});

export const kilometrageLayer = new KilometrageLayer({
  mapboxLayer: anlagenverantwortliche,
});

export default [
  anlagenverantwortliche,
  regionenkarteOverlayGroup,
  regionenkartePublicSegment,
  kilometrageLayer,
];
