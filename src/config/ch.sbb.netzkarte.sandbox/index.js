import { Layer } from 'mobility-toolbox-js/ol';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';
import LevelLayer from '../../layers/LevelLayer';
import { netzkarteLayer } from '../ch.sbb.netzkarte';

export const sandboxDataLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.data',
  visible: true,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2_legacy',
  properties: {
    hideInLegend: true,
  },
});

export const geschosseLayer = new Layer({
  name: 'ch.sbb.geschosse',
  visible: true,
});

geschosseLayer.children = [-4, -3, -2, -1, 0, '2D', 1, 2, 3, 4].map((level) => {
  return new LevelLayer({
    name: `ch.sbb.geschosse${level}`,
    visible: level === '2D',
    mapboxLayer: sandboxDataLayer,
    isQueryable: false,
    styleLayersFilter: ({ metadata }) => metadata && metadata['geops.filter'],
    level,
    properties: {
      radioGroup: 'ch.sbb.geschosse-layer',
      parent: geschosseLayer,
    },
  });
});

export default [sandboxDataLayer, netzkarteLayer, geschosseLayer];
