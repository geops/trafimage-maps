import { MapboxStyleLayer as MTMapboxStyleLayer } from "mobility-toolbox-js/ol";

/**
 * Layer for visualizing information about stations (default) or airports.
 * The popup contains links to station plans, station coordinates
 * and links to timetable, services, shopping, handicap information.
 *
 * <img src="img/layers/stationsLayer/layer.png" alt="Layer preview" title="Layer preview">
 *
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/Layer%20js~Layer%20html}
 * @class
 * @param {Object} [options] Layer options.
 * @inheritdoc
 * @private
 */
class MapboxStyleLayer extends MTMapboxStyleLayer {
  constructor(options = {}) {
    super({ ...options, isHoverActive: false, isClickActive: false });

    this.style = options.style;
    this.filters = options.filters;
    this.hidePopupFunc = options.hidePopup;
  }

  hidePopup(feat, layer, featureInfo) {
    return this.hidePopupFunc && this.hidePopupFunc(feat, layer, featureInfo);
  }

  /**
   * Apply visibility to style layers that fits the filter function.
   * @private
   */
  applyLayoutVisibility(evt) {
    const { visible } = this;
    const { mbMap } = this.mapboxLayer;

    if (!mbMap) {
      return;
    }

    const style = mbMap.getStyle();

    if (!style) {
      return;
    }

    if (this.style && visible) {
      this.mapboxLayer.forceUrl = this.forceUrl;
      this.mapboxLayer.setStyle(this.style);
    }

    super.applyLayoutVisibility(evt);
  }

  getFeatureInfoAtCoordinate(...args) {
    return super.getFeatureInfoAtCoordinate(...args).then((featureInfo) => {
      let { features } = featureInfo;
      const filter = this.get("featureInfoFilter");
      if (filter) {
        features = featureInfo.features.filter(filter);
      }
      return { ...featureInfo, features, layer: this };
    });
  }

  /**
   * Create exact copy of the MapboxLayer
   * @returns {MapboxLayer} MapboxLayer
   */
  clone(newOptions) {
    return new MapboxStyleLayer({ ...this.options, ...newOptions });
  }
}

export default MapboxStyleLayer;
