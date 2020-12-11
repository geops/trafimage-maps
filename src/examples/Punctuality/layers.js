import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

export const netzkarteLayer = new TrafimageMapboxLayer({
  key: 'ch.sbb.netzkarte',
  isBaseLayer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2',
});

export default [netzkarteLayer];
