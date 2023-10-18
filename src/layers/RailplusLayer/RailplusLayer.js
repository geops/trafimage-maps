import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';

/**
 * Layer for RailplusLayer
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class RailplusLayer extends MapboxStyleLayer {
  onLoad() {
    super.onLoad();
    this.fetchRailplusProviders();
  }

  fetchRailplusProviders() {
    fetch(
      `${this.mapboxLayer.url}/data/ch.railplus.meterspurbahnen.json?key=${this.mapboxLayer.apiKey}`,
    )
      .then((res) => res.json())
      .then((data) => {
        this.railplusProviders = data['geops.railplus.tu_info'];
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }
}

export default RailplusLayer;
