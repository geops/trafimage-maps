import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';

/**
 * Layer for BeleuchtungsLayer
 * Extends {@link https://mobility-toolbox-js.geops.io/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class BeleuchtungsLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super(options);
  }

  getFeatureInfoAtCoordinate(coordinate) {
    return super.getFeatureInfoAtCoordinate(coordinate).then((data) => {
      const featureInfo = { ...data };
      if (featureInfo.features.length > 1) {
        /**
         * Every station has two point features with different styles (small icon for low resolution, large icon for large resolution)
         * We make sure only unique features are selected for the popup to avoid unnecessary pagination.
         * @ignore
         */
        const feats = featureInfo.features.reduce((uniques, feature) => {
          const isUnique = !uniques.find(
            (f) => f.get('name') === feature.get('name'),
          );
          return isUnique ? [...uniques, feature] : uniques;
        }, []);
        featureInfo.features = feats;
      }
      return featureInfo;
    });
  }
}

export default BeleuchtungsLayer;
