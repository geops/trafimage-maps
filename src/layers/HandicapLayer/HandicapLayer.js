import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';
import { Style, RegularShape, Stroke, Fill } from 'ol/style';
import getFeatureGeometry from '../../utils/getFeatureGeometry';
import CONF from '../../config/appConfig';

/**
 * Layer for visualizing Handicap Topic.
 * @class
 * @params {Object} options
 * @inheritdoc
 */
class HandicapLayer extends VectorLayer {
  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
      source: new OLVectorSource({
        format: new GeoJSON(),
        loader: () => {
          fetch(
            `${CONF.cartaroUrl}handicap/items/?has_changes=true` +
              '&stuetzpunktbahnhof=true',
          )
            .then(data => data.json())
            .then(data => {
              const format = new GeoJSON();
              const features = format.readFeatures(data);
              this.olLayer.getSource().clear();
              this.olLayer.getSource().addFeatures(features);
            });
        },
      }),
      zIndex: 0,
    });

    super({
      ...options,
      olLayer,
    });

    this.setVisible(this.visible);

    this.wktFormat = new WKT();

    this.onClick(f => {
      [this.clickedFeature] = f;
      this.olLayer.changed();
    });
  }

  /**
   * Create Style from feature
   * @param {ol.feature} feature
   * @returns {Object|null}
   */
  style(feature, resolution) {
    const geometry = getFeatureGeometry(feature, resolution, this.wktFormat);

    if (!geometry || feature.get('visibility') < resolution * 10) {
      return null;
    }

    return new Style({
      geometry,
      image: new RegularShape({
        radius: 12,
        points: 4,
        angle: Math.PI / 4,
        fill: new Fill({
          color: [237, 125, 49, feature === this.clickedFeature ? 1 : 0.5],
        }),
        stroke: new Stroke({
          color: '#ed7d31',
          width: 2,
        }),
      }),
    });
  }
}

export default HandicapLayer;
