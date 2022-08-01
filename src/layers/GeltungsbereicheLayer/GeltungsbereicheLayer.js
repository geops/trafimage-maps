import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';

/**
 * Layer for GeltungsbereicheLayer
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class GeltungsbereicheLayer extends MapboxStyleLayer {
  getFeatureInfoAtCoordinate(coordinate) {
    const zoom = this.map?.getView().getZoom();
    this.mapboxLayer.hitTolerance = zoom < 15 ? 15 : 5;

    return super.getFeatureInfoAtCoordinate(coordinate).then((data) => {
      // const sortedData = data.sort((a, b) => {
      //   if (a.get('valid_ga_hta'))
      // }
      const featureInfo = {
        ...data,

        // The sort only work for geltungsbereiche non BETA topic
        features: data.features.sort((a, b) => {
          // Sort by highest valid_ga_hta value
          if (a.get('valid_ga_hta') > b.get('valid_ga_hta')) {
            return -1;
          }
          if (a.get('valid_ga_hta') < b.get('valid_ga_hta')) {
            return 1;
          }
          return 0;
        }),
      };
      if (featureInfo.features.length > 1) {
        /**
         * We make sure only unique features are selected for the popup to avoid unnecessary pagination.
         * only geltungsbereiche BETA topic, for geltungsbreiche non BETA topic, we only show the first feature.
         * @ignore
         */
        const feats = featureInfo.features.reduce((uniques, feature) => {
          // Geltungsbereiche topic BETA
          if (feature.get('geltungsbereiche')) {
            const isUnique = !uniques.find(
              (f) =>
                f.get('geltungsbereiche') === feature.get('geltungsbereiche'),
            );
            return isUnique ? [...uniques, feature] : uniques;
          }
          return [...uniques, feature];
        }, []);
        featureInfo.features = feats;
      }
      return featureInfo;
    });
  }
}

export default GeltungsbereicheLayer;
