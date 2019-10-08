import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, RegularShape, Stroke, Fill } from 'ol/style';
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
          fetch(`${CONF.cartaroUrl}handicap/items/`)
            .then(data => data.json())
            .then(data => {
              const format = new GeoJSON();
              let features = format.readFeatures(data);
              features = features.filter(
                f =>
                  f.get('stuetzpunktbahnhof') === this.showStuetzpunktbahnhof,
              );
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

    this.showStuetzpunktbahnhof = options.showStuetzpunktbahnhof;

    this.onClick(f => {
      [this.clickedFeature] = f;
      this.olLayer.changed();
    });

    this.clickedStyle = new Style({
      image: new RegularShape({
        radius: 12,
        points: 4,
        angle: Math.PI / 4,
        stroke: new Stroke({
          color: '#ed7d31',
          width: 5,
        }),
        fill: new Fill({
          color: [0, 61, 133, 0.3],
        }),
      }),
    });

    this.defaultStyle = new Style({
      image: new RegularShape({
        radius: 12,
        points: 4,
        angle: Math.PI / 4,
        stroke: new Stroke({
          color: '#ed7d31',
          width: 5,
        }),
      }),
    });
  }

  /**
   * Create Style from feature
   * @param {ol.feature} feature
   * @returns {Object|null}
   */
  style(feature) {
    if (feature === this.clickedFeature) {
      return this.clickedStyle;
    }

    return this.defaultStyle;
  }
}

export default HandicapLayer;
