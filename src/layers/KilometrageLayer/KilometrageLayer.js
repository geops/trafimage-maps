import { Layer } from 'mobility-toolbox-js/ol';
import { Feature } from 'ol';

/**
 * Layer for kilometrage popup
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/Layer%20js~Layer%20html}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class KilometrageLayer extends Layer {
  getFeatureInfoAtCoordinate(coordinate) {
    const layer = this;
    // radius = 5 pixel * mapResolution
    return fetch(
      `${
        this.cartaroUrl
      }lines/kilometration/?coord=${coordinate.toString()}&radius=${
        5 * this.map.getView().getResolution()
      }`,
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
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.error('Kilometrage request needs CORS to work properly');
        return { features: [], layer, coordinate };
      });
  }

  setCartaroUrl(cartaroUrl) {
    this.cartaroUrl = cartaroUrl;
  }
}

export default KilometrageLayer;
