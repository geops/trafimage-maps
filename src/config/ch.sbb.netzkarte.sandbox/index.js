import { Layer } from 'mobility-toolbox-js/ol';
import LevelLayer from '../../layers/LevelLayer';
import { dataLayer, netzkarteLayer } from '../ch.sbb.netzkarte';

export const geschosseLayer = new Layer({
  name: 'ch.sbb.geschosse',
  visible: true,
});

geschosseLayer.children = [-4, -3, -2, -1, 0, '2D', 1, 2, 3, 4].map((level) => {
  return new LevelLayer({
    name: `ch.sbb.geschosse${level}`,
    visible: level === '2D',
    mapboxLayer: dataLayer,
    isQueryable: false,
    styleLayersFilter: ({ metadata }) => metadata && metadata['geops.filter'],
    level,
    properties: {
      radioGroup: 'ch.sbb.geschosse-layer',
      parent: geschosseLayer,
    },
  });
});

export default [dataLayer, netzkarteLayer, geschosseLayer];
