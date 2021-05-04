import { Layer } from 'mobility-toolbox-js/ol';
import OLVectorLayer from 'ol/layer/Vector';
import { Feature } from 'ol';

/**
 * Layer for kilometrage popup
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/Layer%20js~Layer%20html}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class KilometrageLayer extends Layer {
  constructor(options = {}) {
    const olLayer = new OLVectorLayer({});

    super({
      ...options,
      olLayer,
    });

    this.setVisible(this.visible);
  }

  getFeatureInfoAtCoordinate(coordinate) {
    const layer = this;

    return fetch(
      `${this.cartaroUrl}lines/kilometration/?coord=${coordinate.toString()}`,
    )
      .then((data) => data.json())
      .then((data) => {
        if (data.error || data.detail || !data.line_number) {
          return { features: [], layer, coordinate };
        }

        const feature = new Feature(data);
        return {
          features: [feature],
          layer,
          coordinate,
        };
      });
  }

  setCartaroUrl(cartaroUrl) {
    this.cartaroUrl = cartaroUrl;
  }
}

export default KilometrageLayer;
