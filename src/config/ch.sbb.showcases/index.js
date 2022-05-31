import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

export const netzkarteShowcasesNight = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.night',
  key: 'ch.sbb.netzkarte.night',
  visible: false,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_dark_v2',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.netzkarte.night-desc',
    radioGroup: 'showcases',
  },
});

export const netzkarteShowcasesNetzkarte = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.layer',
  key: 'ch.sbb.netzkarte.layer',
  visible: false,
  isQueryable: false,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'base_bright_v2',
  properties: {
    hasInfos: true,
    description: 'ch.sbb.netzkarte-desc',
    radioGroup: 'showcases',
  },
});

export default [netzkarteShowcasesNight, netzkarteShowcasesNetzkarte];
