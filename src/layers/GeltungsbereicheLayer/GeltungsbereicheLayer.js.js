import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';

/**
 * Layer for GeltungsbereicheLayer
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class GeltungsbereicheLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super(options);
  }

  getFeatureInfoAtCoordinate(coordinate) {
    return super.getFeatureInfoAtCoordinate(coordinate).then((data) => {
      const featureInfo = { ...data };
      if (featureInfo.features.length > 1) {
        /**
         * We make sure only unique features are selected for the popup to avoid unnecessary pagination.
         * @ignore
         */
        const feats = featureInfo.features.reduce((uniques, feature) => {
          const isUnique = !uniques.find(
            (f) =>
              f.get('geltungsbereiche') === feature.get('geltungsbereiche'),
          );
          return isUnique ? [...uniques, feature] : uniques;
        }, []);
        featureInfo.features = feats;
      }
      return featureInfo;
    });
  }
}

export default GeltungsbereicheLayer;
