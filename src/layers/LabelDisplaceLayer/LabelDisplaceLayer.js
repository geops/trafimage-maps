/* eslint-disable no-useless-return */
import { MapboxStyleLayer } from "mobility-toolbox-js/ol";

/**
 * Layer for LabelDisplaceLayer
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class LabelDisplaceLayer extends MapboxStyleLayer {
  // eslint-disable-next-line no-unused-vars
  addDisplaceFeature(feature) {
    const { mbMap } = this.mapboxLayer;

    if (!mbMap) {
      return;
    }
    return;
    // console.log(mbMap.getSource("printframe"));
  }
}

export default LabelDisplaceLayer;
