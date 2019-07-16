import qs from 'querystring';
import WMTSSource from 'ol/source/WMTS';
import Layer from 'react-spatial/Layer';

/**
 * Base layer for ZoneLayer and RouteLayer.
 * @class TrafimageLayer
 */
class TrafimageLayer extends Layer {
  static getTokenUrl(url, token) {
    const [u, search] = url.split('?');
    const params = qs.parse(search);
    return `${u}?${qs.stringify({ key: token, ...params })}`;
  }

  /**
   * @param {Object} [options] Layer options.
   * @param {string} [options.token] Access token for geOps services.
   */
  constructor(options = {}) {
    super(options);

    // Access token for geOps services
    this.token = options.token;

    // Array of click callbacks
    this.clickCallbacks = [];

    // Add token
    this.setToken(this.token);
  }

  setToken(token) {
    if (!token) {
      return;
    }

    this.token = token;
    const source = this.olLayer.getSource();

    if (source instanceof WMTSSource) {
      const urls = source
        .getUrls()
        .map(url => TrafimageLayer.getTokenUrl(url, this.token));

      source.setUrls(urls);
    }
  }

  /**
   * Listens to click events on the layer.
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

export default TrafimageLayer;
