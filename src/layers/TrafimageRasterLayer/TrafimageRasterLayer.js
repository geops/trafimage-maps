import qs from 'querystring';
import WMTSSource from 'ol/source/WMTS';
import Layer from 'react-spatial/Layer';

/**
 * Base layer for ZoneLayer and RouteLayer.
 * @class TrafimageLayer
 */
class TrafimageRasterLayer extends Layer {
  static getApiKeyUrl(url, apiKey) {
    const [u, search] = url.split('?');
    const params = qs.parse(search);
    return `${u}?${qs.stringify({ key: apiKey, ...params })}`;
  }

  /**
   * @param {Object} [options] Layer options.
   * @param {string} [options.apiKey] Access key for geOps services.
   */
  constructor(options = {}) {
    super(options);

    // Access apiKey for geOps services
    this.apiKey = options.apiKey;

    // Add apiKey
    this.setApiKey(this.apiKey);
  }

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
