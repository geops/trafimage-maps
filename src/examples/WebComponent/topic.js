import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

const netzkarteLayer = new TrafimageMapboxLayer({
  name: 'Netzkarte',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  style: 'netzkarte_personenverkehr',
});

export default {
  name: 'Default',
  key: 'default',
  elements: {
    menu: false,
    header: true,
    footer: true,
    permalink: false,
  },
  layers: [netzkarteLayer],
};
