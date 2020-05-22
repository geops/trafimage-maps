import Layer from 'react-spatial/layers/Layer';
import WMTSSource from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import TileLayer from 'ol/layer/Tile';
import TrafimageMapboxLayer from '../../layers/TrafimageMapboxLayer';

const projectionExtent = [
  -20037509.3428,
  -20037508.3428,
  20037508.3428,
  20037508.3428,
];

const resolutions = [
  156543.033928,
  78271.516964,
  39135.758482,
  19567.879241,
  9783.9396205,
  4891.96981025,
  2445.98490513,
  1222.99245256,
  611.496226281,
  305.748113141,
  152.87405657,
  76.4370282852,
  38.2185141426,
  19.1092570713,
  9.55462853565,
  4.77731426782,
  2.38865713391,
  1.19432856696,
  0.597164283478,
  0.298582141739,
];

const netzkarteLayer = new TrafimageMapboxLayer({
  name: 'ch.sbb.netzkarte',
  copyright: '© OpenStreetMap contributors, OpenMapTiles, imagico, SBB/CFF/FFS',
  visible: true,
  isBaseLayer: true,
  style: 'netzkarte_personenverkehr_v3',
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
  style: 'netzkarte_personenverkehr_v3',
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

const swisstopoSwissImage = new Layer({
  name: 'ch.sbb.netzkarte.luftbild',
  copyright: 'swisstopo (5704003351)',
  isBaseLayer: true,
  visible: false,
  olLayer: new TileLayer({
    source: new WMTSSource({
      url:
        `//maps.trafimage.ch/geo-admin-wmts/1.0.0/` +
        `ch.swisstopo.swissimage/default/current/3857/` +
        '{TileMatrix}/{TileCol}/{TileRow}.jpeg',
      matrixSet: 'webmercator',
      projection: 'EPSG:3857',
      requestEncoding: 'REST',
      transition: 0,
      crossOrigin: 'anonymous',
      tileGrid: new WMTSTileGrid({
        extent: projectionExtent,
        resolutions,
        matrixIds: resolutions.map((r, i) => `${i}`),
      }),
    }),
  }),
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
  layers: [netzkarteShowcasesLight, netzkarteLayer, swisstopoSwissImage],
};
