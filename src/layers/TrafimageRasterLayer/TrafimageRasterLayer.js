import qs from 'querystring';
import WMTSSource from 'ol/source/WMTS';
import Layer from 'react-spatial/Layer';

/**
 * Base layer for ZoneLayer and RouteLayer.
 * Extends {@link https://react-spatial.geops.de/docjs.html#layer geops-spatial/Layer}
 * @class
 * @param {Object} options Layer options.
 * @param {string} options.apiKey Access key for geOps services.
 */
class TrafimageRasterLayer extends Layer {
  static getApiKeyUrl(url, apiKey) {
    const [u, search] = url.split('?');
    const params = qs.parse(search);
    return `${u}?${qs.stringify({ key: apiKey, ...params })}`;
  }

  constructor(options = {}) {
    super(options);

    // Access apiKey for geOps services
    this.apiKey = options.apiKey;

    // Add apiKey
    this.setApiKey(this.apiKey);
  }

  /**
   * Set a new Api Key
   * @param {String} apiKey
   */
  setApiKey(apiKey) {
    if (!apiKey) {
      return;
    }

    this.apiKey = apiKey;
    const source = this.olLayer.getSource();

    if (source instanceof WMTSSource) {
      const urls = source
        .getUrls()
        .map(url => TrafimageRasterLayer.getApiKeyUrl(url, this.apiKey));

      source.setUrls(urls);
    }
  }
}

export default TrafimageRasterLayer;
