import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import intersect from '@turf/intersect';
import { Style, Fill, Stroke } from 'ol/style';

const format = new GeoJSON();

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
    this.selectedZone = null;
  }

  /**
   * @override
   */
  init(map) {
    super.init(map);
    this.source = map.getLayers().getArray()[0].getSource(); // Get vector layer source
    this.olListenersKeys.push(this.map.on('click', (e) => this.selectZone(e))); // Add click listener
  }

  /**
   * @override
   */
  terminate(map) {
    // Remove selected feature on terminate
    if (this.selectedZone && this.source.hasFeature(this.selectedZone)) {
      this.source.removeFeature(this.selectedZone);
      this.selectedZone = null;
    }
    super.terminate(map);
  }

  selectZone(e) {
    // Remove previous selection
    if (this.selectedZone && this.source.hasFeature(this.selectedZone)) {
      this.source.removeFeature(this.selectedZone);
      this.selectedZone = null;
    }
    this.getFeatureInfoAtCoordinate(e.coordinate).then((data) => {
      const [feature] = data.features; // Municipality feature containing the zone objects in the properties
      const zones = feature?.get('zones');

      if (!feature || !zones || !zones[0]) {
        // Abort if no zone or feature present
        return null;
      }

      /**
       * If multiple zones present, the zones are intersected with one another
       * Then they are intersected with the municipality feature separately for readability
       */
      const zoneFeatureArray = zones.map((zone) => {
        return new Feature(zone.geometry);
      });
      let zonesIntersection;
      let intersected = format.writeFeatureObject(zoneFeatureArray[0]);
      if (zoneFeatureArray.length > 1) {
        // When there are multiple zones intersect them
        zoneFeatureArray.forEach((feat) => {
          intersected = intersect(intersected, format.writeFeatureObject(feat));
        });
        zonesIntersection = format.readFeature(intersected);
      } else {
        // When there is one zone
        [zonesIntersection] = zoneFeatureArray;
      }

      // Intersect zones with municipality feature and create ol feature
      const finalIntersection = intersect(
        format.writeFeatureObject(zonesIntersection),
        format.writeFeatureObject(feature),
      );
      const intersection = format.readFeature(finalIntersection);

      // Highlight feature
      intersection.setStyle(
        new Style({
          fill: new Fill({
            color: [192, 57, 43, 0.5],
          }),
          stroke: new Stroke({
            color: [207, 0, 15, 1],
            lineDash: [10, 10],
            width: 4,
          }),
          zIndex: 999,
        }),
      );

      // Add feature to map and store it for reference
      this.source.addFeature(intersection);
      this.selectedZone = intersection;
      return null;
    });
  }

  getFeatureInfoAtCoordinate(coordinate) {
    return super.getFeatureInfoAtCoordinate(coordinate).then((data) => {
      const featureInfo = { ...data };
      const municipalityFeature = featureInfo.features.find(
        (feat) => feat.get('source') === 'verbund',
      );

      /**
       * We omit getFeatureInfo if:
       * - There is no feature in verbundskarte layer (in some places the other two layers overlap with overflow)
       * - There is a feature in verbundskarte layer, but no zones and no z-pass features
       */
      if (!municipalityFeature) {
        featureInfo.features = [];
        return featureInfo;
      }

      // Extract zones and store them in the municipality feature
      const zoneFeatures = featureInfo.features.filter(
        (feat) => feat.get('zone') && feat.get('verbund'),
      );

      if (zoneFeatures[0]) {
        const zones = zoneFeatures.map((zone) => zone.getProperties());
        const cleanedZones = [
          ...new Map(zones.map((zone) => [zone.verbund, zone])).values(), // Remove duplicates
        ];
        municipalityFeature.set('zones', cleanedZones);
      }

      // Extract z-Pass and store in the municipality feature
      const zPassFeature = featureInfo.features.find(
        (feat) => feat.get('source') === 'z-pass',
      );

      if (zPassFeature) {
        municipalityFeature.set('zPass', zPassFeature.getProperties());
      }

      // Return municipality feature only to avoid popup pagination
      featureInfo.features = [municipalityFeature];
      return featureInfo;
    });
  }
}

export default TarifverbundkarteLayer;
