import MapboxStyleLayer from "../MapboxStyleLayer";

/**
 * Layer for Handicap
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class HandicapLayer extends MapboxStyleLayer {
  getFeatureInfoAtCoordinate(coordinate) {
    return super.getFeatureInfoAtCoordinate(coordinate).then((data) => {
      // Remove duplicate features.
      return {
        ...data,
        features: data.features.reduce((acc, feature) => {
          return acc.find((f) => f.get("uic") === feature.get("uic"))
            ? acc
            : [...acc, feature];
        }, []),
      };
    });
  }
}

export default HandicapLayer;
