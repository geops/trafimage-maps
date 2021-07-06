import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

const netzkarteLayer = new TrafimageMapboxLayer({
  name: 'Netzkarte',
  visible: true,
  style: 'base_bright_v2',
});

export default {
  name: 'Default',
  key: 'default',
  elements: {
    menu: false,
    header: true,
    footer: true,
    permalink: false,
    copyright: true,
  },
  layers: [netzkarteLayer],
};
