import { Layer } from 'mobility-toolbox-js/ol';
import MapboxStyleLayer from '../../layers/MapboxStyleLayer';
import LevelLayer from '../../layers/LevelLayer';
import { dataLayer, netzkarteLayer } from '../ch.sbb.netzkarte';
import netzkarte from '../../img/netzkarte.png';

export const poiLayer = new MapboxStyleLayer({
  name: 'ROKAS-POIs',
  key: 'ch.sbb.poi',
  group: 'baseLayer',
  properties: {
    previewImage: netzkarte,
    isBaseLayer: true,
  },
  visible: false,
  mapboxLayer: dataLayer,
  styleLayersFilter: ({ metadata }) =>
    !!metadata && metadata['trafimage.filter'] === 'perimeter_mask',
  style: 'base_bright_v2_poi',
});

export const geschosseLayer = new Layer({
  name: 'ch.sbb.geschosse',
  visible: true,
});

geschosseLayer.children = [-4, -3, -2, -1, 0, '2D', 1, 2, 3, 4].map((level) => {
  return new LevelLayer({
    name: `ch.sbb.geschosse${level}`,
    visible: level === '2D',
    mapboxLayer: dataLayer,
    styleLayersFilter: ({ metadata }) => metadata && metadata['geops.filter'],
    level,
    group: 'ch.sbb.geschosse-layer',
    properties: {
      parent: geschosseLayer,
    },
  });
});

export default [dataLayer, netzkarteLayer, poiLayer, geschosseLayer];
