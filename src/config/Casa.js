import MapboxLayer from 'react-spatial/layers/MapboxLayer';
import CONF from './appConfig';

const netzkarteLayer = new MapboxLayer({
  name: 'Netzkarte',
  key: 'ch.sbb.netzkarte',
  copyright: 'OpenStreetMap contributors, © SBB/CFF/FFS',
  visible: true,
  isBaseLayer: true,
  preserveDrawingBuffer: true,
  zIndex: -1, // Add zIndex as the MapboxLayer would block tiled layers (buslines)
  url: `${CONF.vectorTilesUrl}/styles/trafimage_perimeter_v2/style.json?key=${CONF.vectorTilesKey}`,
});

export default {
  name: 'CASA',
  key: 'ch.sbb.casa',
  layers: [netzkarteLayer],
  projection: 'EPSG:3857',
};
