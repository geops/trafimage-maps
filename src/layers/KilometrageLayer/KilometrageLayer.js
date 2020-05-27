import Layer from 'react-spatial/layers/Layer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { transform } from 'ol/proj';

/**
 * Layer for kilometrage popup
 * Extends {@link https://react-spatial.geops.de/docjs.html#layer geops-spatial/Layer}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class KilometrageLayer extends Layer {
  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
      source: new OLVectorSource({
        format: new GeoJSON(),
      }),
    });

    super({
      ...options,
      olLayer,
    });

    this.setVisible(this.visible);
  }

  getFeatureInfoAtCoordinate(coordinate) {
    const layer = this;
    const meterRad = this.map && this.map.getView().getZoom() > 11 ? 100 : 1000;

    const [newX, newY] = transform(
      [parseInt(coordinate[0], 10), parseInt(coordinate[1], 10)],
      'EPSG:3857',
      'EPSG:21781',
    );

    return fetch(
      `${this.geoServerUrl}?` +
        'service=WFS&version=1.0.0&request=GetFeature&' +
        `typeName=linien_qry_fanas&` +
        'srsName=EPSG:3857&maxFeatures=50&' +
        'outputFormat=application/json&' +
        `viewparams=x:${parseInt(newX, 10)};y:${parseInt(
          newY,
          10,
        )};r:${meterRad}`,
    )
      .then((data) => data.json())
      .then((data) => {
        const format = new GeoJSON();
        const features = format.readFeatures(data);

        return {
          features,
          layer,
          coordinate,
        };
      });
  }

  setGeoServerUrl(geoServerUrl) {
    this.geoServerUrl = geoServerUrl;
  }
}

export default KilometrageLayer;
