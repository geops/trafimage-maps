import Layer from 'react-spatial/Layer';

/**
 * Base layer for ZoneLayer and RouteLayer.
 * @class CasaLayer
 */
class CasaLayer extends Layer {
  constructor(options = {}) {
    super(options);

    // Array of click callbacks
    this.clickCallbacks = [];
  }

  /**
   * Listens to click events on the layer.
   * @function onClick()
   * @param {function} callback Callback function, called with the clicked
   * Features (https://openlayers.org/en/latest/apidoc/module-ol_Feature.html)
   */
  onClick(callback) {
    if (typeof callback === 'function') {
      this.clickCallbacks.push(callback);
    } else {
      throw new Error('callback must be of type function.');
    }
  }

  init(map) {
    super.init(map);
    this.map = map;

    if (this.clickCallbacks.length) {
      this.map.on('singleclick', e => {
        const clickedFeatures = [];
        const layerFeatures = this.olLayer.getSource().getFeatures();

        this.map.forEachFeatureAtPixel(e.pixel, f => {
          if (layerFeatures.includes(f)) {
            clickedFeatures.push(f);
          }
        });

        if (clickedFeatures.length) {
          this.clickCallbacks.forEach(c => c(clickedFeatures));
        }
      });
    }
  }
}

export default CasaLayer;
