import { Layer } from 'mobility-toolbox-js/ol';
import GeometryType from 'ol/geom/GeometryType';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import { kilometrageLayer } from '../ch.sbb.infrastruktur';

export const anlagenverantwortliche = new TrafimageMapboxLayer({
  name: 'ch.sbb.anlagenverantwortliche',
  style: 'netzkarte_eisenbahninfrastruktur_v3_ch.sbb.anlagenverantwortliche',
  isBaseLayer: false,
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1,
  properties: {
    hideInLegend: true,
  },
});

export const regionenkartePublicSegment = new Layer({
  name: 'ch.sbb.regionenkarte.intern.av_segmente.public',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    layerInfoComponent: 'RegionenkartePublicLayerInfo',
  },
  children: [
    new MapboxStyleLayer({
      name: 'ch.sbb.regionenkarte.lines',
      isQueryable: true,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /anlagenverantwortliche\.lines$/.test(id);
      },
      featureInfoFilter: (feature) => {
        // There is some points in this data source and we don't want them.
        return (
          feature.getGeometry().getType() === GeometryType.LINE_STRING ||
          feature.getGeometry().getType() === GeometryType.MULTI_LINE_STRING
        );
      },
      properties: {
        hideInLegend: true,
        useOverlay: true, // instead of a Popup , on click an Overlay will be displayed.
        popupComponent: 'RegionenkarteSegmentPopup',
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.regionenkarte.stations',
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
      name: 'ch.sbb.regionenkarte.regionintersection',
      isQueryable: true,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /anlagenverantwortliche\.regionintersection/.test(id);
      },
      properties: {
        hideInLegend: true,
        showPopupOnHover: true,
        popupComponent: 'RegionenkarteIntersectionPopup',
      },
    }),
  ],
});

export const regionenkarteOverlayGroup = new Layer({
  name: 'ch.sbb.infrastruktur.overlay.group',
  visible: true,
  isQueryable: false,
  properties: {
    hasInfos: true,
    description: 'ch.sbb.infrastruktur.overlay.group-desc',
  },
  children: [
    new MapboxStyleLayer({
      name: 'ch.sbb.infrastruktur.betriebspunkte',
      visible: true,
      isQueryable: false,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        // We select all stations
        return /FanasStation/.test(id);
      },
      properties: {
        hasInfos: true,
        description: 'ch.sbb.infrastruktur.betriebspunkte-desc',
      },
    }),
    new MapboxStyleLayer({
      name: 'ch.sbb.infrastruktur.line_point',
      visible: true,
      isQueryable: false,
      mapboxLayer: anlagenverantwortliche,
      styleLayersFilter: ({ id }) => {
        return /FanasLine|DFA/.test(id);
      },
      properties: {
        hasInfos: true,
        description: 'ch.sbb.infrastruktur.line_point-desc',
      },
    }),
  ],
});

export default [
  anlagenverantwortliche,
  regionenkarteOverlayGroup,
  regionenkartePublicSegment,
  kilometrageLayer,
];