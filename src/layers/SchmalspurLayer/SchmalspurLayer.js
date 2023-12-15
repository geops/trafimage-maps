import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';

/**
 * Layer for SchmalspurLayer
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class SchmalspurLayer extends MapboxStyleLayer {
  onLoad() {
    super.onLoad();
    this.fetchSource();
  }

  fetchSource() {
    const { url } =
      this.mapboxLayer?.mbMap?.getSource('ch.sbb.isb.schmalspur') || {};
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.tuInfos = data['geops.isb.schmalspur.tu_info'];
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }
}

export default SchmalspurLayer;
