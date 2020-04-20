import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';
import { Style, Circle, Fill, Icon } from 'ol/style';
import LayerHelper from '../layerHelper';

/**
 * Layer for visualizing Handicap Topic.
 * @class
 * @private
 * @params {Object} options
 * @inheritdoc
 */
class HandicapLayer extends VectorLayer {
  constructor(options = {}) {
    const { handicapType, zIndex } = options.properties;

    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r, handicapType),
      source: new OLVectorSource({
        format: new GeoJSON(),
        loader: () => {
          fetch(
            `${this.cartaroUrl}handicap/items/?has_changes=true&${
              handicapType === 'stuetzpunkt' ? 'stuetzpunktbahnhof=true' : ''
            }`,
          )
            .then((data) => data.json())
            .then((data) => {
              const format = new GeoJSON();
              let features = format.readFeatures(data);
              if (handicapType !== 'stuetzpunkt') {
                features = features.filter((feat) => {
                  if (handicapType === 'barrierfree') {
                    return feat.get('barrierefreier_bahnhof') === true;
                  }
                  return feat.get('barrierefreier_bahnhof') === false;
                });
              }
              this.olLayer.getSource().clear();
              this.olLayer.getSource().addFeatures(features);
            });
        },
      }),
      zIndex: 0,
    });

    if (zIndex) {
      olLayer.setZIndex(zIndex);
    }

    super({
      ...options,
      olLayer,
    });

    this.hidePopup = options.hidePopup;
    this.setVisible(this.visible);

    this.wktFormat = new WKT();

    this.onClick((f) => {
      [this.clickedFeature] = f;
      this.olLayer.changed();
    });
  }

  getIconStyle(geometry, handicapType, isHighlighted = false) {
    if (handicapType === 'stuetzpunkt') {
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
    return [
      new Style({
        geometry,
        image: new Icon({
          src: `${this.staticFilesUrl}/img/layers/handicap/${
            handicapType === 'barrierfree'
              ? 'barrierfreierBahnhoefe'
              : 'nichtBarrierfreierBahnhoefe'
          }.png`,
          scale: 0.5,
        }),
      }),
    ];
  }

  setCartaroUrl(cartaroUrl) {
    this.cartaroUrl = cartaroUrl;
  }

  setStaticFilesUrl(staticFilesUrl) {
    this.staticFilesUrl = staticFilesUrl;
  }

  /**
   * Create Style from feature
   * @param {ol.feature} feature
   * @returns {Object|null}
   */
  style(feature, resolution, handicapType) {
    const gen = LayerHelper.getMapboxGeneralization(resolution);
    const wkt = (feature.get('generalizations') || {})[`geom_gen${gen}`];
    const geometry = wkt
      ? this.wktFormat.readGeometry(wkt.split(';')[1])
      : null;

    const minVisibility = LayerHelper.getMapboxDataResolution(resolution) * 10;

    if (!geometry || feature.get('visibility') < minVisibility) {
      return null;
    }

    const isHighlighted = feature === this.clickedFeature;

    return this.getIconStyle(geometry, handicapType, isHighlighted);
  }
}

export default HandicapLayer;
