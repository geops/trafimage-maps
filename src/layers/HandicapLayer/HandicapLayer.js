import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';
import { Style, RegularShape, Fill } from 'ol/style';
import LayerHelper from '../layerHelper';
import CONF from '../../config/appConfig';

/**
 * Layer for visualizing Handicap Topic.
 * @class
 * @params {Object} options
 * @inheritdoc
 */
class HandicapLayer extends VectorLayer {
  static getRectangleStyle(geometry, radius = 12, opacity = 1) {
    return new Style({
      geometry,
      image: new RegularShape({
        radius,
        points: 4,
        angle: Math.PI / 4,
        fill: new Fill({
          color: [237, 125, 49, opacity],
        }),
      }),
    });
  }

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
    let geometry = feature.getGeometry();
    let gen = 100;
    gen = resolution < 500 ? 30 : gen;
    gen = resolution < 200 ? 10 : gen;
    gen = resolution < 100 ? null : gen;

    if (gen) {
      const wkt = (feature.get('generalizations') || {})[`geom_gen${gen}`];
      geometry = wkt ? this.wktFormat.readGeometry(wkt.split(';')[1]) : null;
    }

    const minVisibility = LayerHelper.getDataResolution(resolution) * 10;
    if (!geometry || feature.get('visibility') < minVisibility) {
      return null;
    }

    const style = [HandicapLayer.getRectangleStyle(geometry)];

    if (feature === this.clickedFeature) {
      style.unshift(HandicapLayer.getRectangleStyle(geometry, 16, 0.5));
    }

    return style;
  }
}

export default HandicapLayer;
