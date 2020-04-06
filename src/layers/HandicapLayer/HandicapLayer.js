import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';
import { Style, Circle, Fill } from 'ol/style';
import LayerHelper from '../layerHelper';

/**
 * Layer for visualizing Handicap Topic.
 * @class
 * @private
 * @params {Object} options
 * @inheritdoc
 */
class HandicapLayer extends VectorLayer {
  static getIconStyle(geometry, isHighlighted = false) {
    return [
      new Style({
        geometry,
        image: new Circle({
          radius: 15,
          fill: new Fill({
            color: [246, 136, 38, isHighlighted ? 0.7 : 0.4],
          }),
        }),
      }),
      new Style({
        geometry,
        image: new Circle({
          radius: 9,
          fill: new Fill({
            color: [246, 136, 38, 1],
          }),
        }),
      }),
    ];
  }

  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
      source: new OLVectorSource({
        format: new GeoJSON(),
        loader: () => {
          fetch(
            `${this.cartaroUrl}handicap/items/?has_changes=true` +
              '&stuetzpunktbahnhof=true',
          )
            .then((data) => data.json())
            .then((data) => {
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

    this.onClick((f) => {
      [this.clickedFeature] = f;
      this.olLayer.changed();
    });
  }

  setCartaroUrl(cartaroUrl) {
    this.cartaroUrl = cartaroUrl;
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

    const isHighlighted = feature === this.clickedFeature;
    return HandicapLayer.getIconStyle(geometry, isHighlighted);
  }
}

export default HandicapLayer;
