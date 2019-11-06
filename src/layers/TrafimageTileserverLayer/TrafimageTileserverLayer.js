import WMTSSource from 'ol/source/WMTS';
import Layer from 'react-spatial/layers/Layer';

class TrafimageTileserverLayer extends Layer {
  constructor(options = {}) {
    super(options);
    this.tileserverLayerName = options.tileserverLayerName;
  }

  setTileserverUrl(tileserverUrl) {
    const source = this.olLayer.getSource();
    if (source instanceof WMTSSource) {
      source.setUrl(
        `${tileserverUrl}/wmts/${this.tileserverLayerName}/webmercator/{TileMatrix}/{TileCol}/{TileRow}.png`,
      );
    }
  }
}

export default TrafimageTileserverLayer;
