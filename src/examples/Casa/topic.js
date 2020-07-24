import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

const netzkarteLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  isBaseLayer: true,
  style: 'base_bright_v1',
  properties: {
    radioGroup: 'baseLayer',
  },
});

// Remove all symbols and circl styles
netzkarteLayer.on('load', () => {
  const styles = [...netzkarteLayer.mbMap.getStyle().layers];
  for (let i = 0; i < styles.length; i += 1) {
    const style = styles[i];
    if (/symbol|circle/i.test(style.type)) {
      netzkarteLayer.mbMap.removeLayer(style.id);
    }
  }
});

export const netzkarteLayerLabels = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte-labels',
  visible: true,
  style: 'base_bright_v1',
});

// Display only symbols and circle styles
netzkarteLayerLabels.on('load', () => {
  const styles = [...netzkarteLayerLabels.mbMap.getStyle().layers];
  for (let i = 0; i < styles.length; i += 1) {
    const style = styles[i];
    if (!/symbol|circle/i.test(style.type)) {
      netzkarteLayerLabels.mbMap.removeLayer(style.id);
    }
  }
});

const netzkarteShowcasesLight = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte.light',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  isBaseLayer: true,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  style: 'showcase3',
  properties: {
    radioGroup: 'baseLayer',
  },
});

export default {
  name: 'CASA',
  key: 'ch.sbb.casa',
  elements: {
    menu: true,
    popup: true,
    permalink: false,
    baseLayerSwitcher: true,
  },
  layers: [netzkarteShowcasesLight, netzkarteLayer],
};
