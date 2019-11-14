import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

const netzkarteLayer = new TrafimageMapboxLayer({
  name: 'Netzkarte',
  key: 'ch.sbb.netzkarte',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  isBaseLayer: true,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'trafimage_perimeter_v2',
});

export default {
  name: 'Default',
  key: 'default',
  elements: {
    menu: true,
    header: true,
    footer: true,
  },
  layers: [netzkarteLayer],
};
