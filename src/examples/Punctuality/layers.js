import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

export const netzkarteLayer = new TrafimageMapboxLayer({
  key: 'ch.sbb.netzkarte',
  isBaseLayer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2',
});

export const buslines = new MapboxStyleLayer({
  name: 'ch.sbb.netzkarte.buslinien',
  mapboxLayer: netzkarteLayer,
  visible: false,
  styleLayer: {
    id: 'bus',
    type: 'line',
    source: 'busline',
    'source-layer': 'busses',
    paint: {
      'line-color': 'rgba(255, 220, 0, 1)',
      'line-width': 3,
      'line-opacity': 1,
    },
  },
});

export default [netzkarteLayer];
