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
        if (data.error || data.detail) {
          return { features: [], layer, coordinate };
        }

        const feature = new Feature();
        feature.setProperties(data);
        return {
          features: [feature],
          layer,
          coordinate,
        };
      });
    // return fetch(
    //   `${this.geoServerUrl}?` +
    //     'service=WFS&version=1.0.0&request=GetFeature&' +
    //     `typeName=linien_qry_fanas&` +
    //     'srsName=EPSG:3857&maxFeatures=50&' +
    //     'outputFormat=application/json&' +
    //     `viewparams=x:${parseInt(newX, 10)};y:${parseInt(
    //       newY,
    //       10,
    //     )};r:${meterRad}`,
    // )
    //   .then((data) => data.json())
    //   .then((data) => {
    //     const format = new GeoJSON();
    //     const features = format.readFeatures(data);

    //     return {
    //       features,
    //       layer,
    //       coordinate,
    //     };
    //   });
  }

  setGeoServerUrl(geoServerUrl) {
    this.geoServerUrl = geoServerUrl;
  }

  setCartaroUrl(cartaroUrl) {
    this.cartaroUrl = cartaroUrl;
  }
}

export default KilometrageLayer;
