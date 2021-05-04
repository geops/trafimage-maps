import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';

/**
 * Layer for TarifverbundkarteLayer
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class TarifverbundkarteLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super({ ...options });
  }

  getFeatureInfoAtCoordinate(coordinate) {
    return super.getFeatureInfoAtCoordinate(coordinate).then((data) => {
      const featureInfo = { ...data };
      const verbundFeature = featureInfo.features.find(
        (feat) => feat.get('source') === 'verbund',
      );

      /**
       * We omit getFeatureInfo if:
       * - There is no feature in verbundskarte layer (in some places the other two layers overlap with overflow)
       * - There is a feature in verbundskarte layer, but no zones and no z-pass features
       */
      if (!verbundFeature) {
        featureInfo.features = [];
        return featureInfo;
      }

      const zoneFeatures = featureInfo.features.filter(
        (feat) => feat.get('zone') && feat.get('verbund'),
      );

      const zPassFeature = featureInfo.features.find(
        (feat) => feat.get('source') === 'z-pass',
      );

      if (zoneFeatures[0]) {
        const zones = zoneFeatures.map((zone) => zone.getProperties());
        const cleanedZones = [
          ...new Map(zones.map((zone) => [zone.verbund, zone])).values(), // Remove duplicates
        ];
        verbundFeature.set('zones', cleanedZones);
      }

      if (zPassFeature) {
        verbundFeature.set('zPass', zPassFeature.getProperties());
      }

      featureInfo.features = [verbundFeature];
      return featureInfo;
    });
  }
}

export default TarifverbundkarteLayer;
