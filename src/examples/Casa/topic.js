import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

const netzkarteLayer = new TrafimageMapboxLayer({
  name: 'Netzkarte',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  style: 'netzkarte_personenverkehr',
});

export default {
  name: 'CASA',
  key: 'ch.sbb.casa',
  elements: {
    menu: true,
    popup: true,
    permalink: false,
  },
  layers: [netzkarteLayer],
};
