import { VectorLayer } from "mobility-toolbox-js/ol";
import { Vector as OLVectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import intersect from "@turf/intersect";
import { Style, Fill, Stroke } from "ol/style";
import MapboxStyleLayer from "../MapboxStyleLayer";

const format = new GeoJSON();

/**
 * Layer for TarifverbundkarteLayer
 * Extends {@link https://mobility-toolbox-js.geops.io/doc/class/build/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class TarifverbundkarteLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    const styleLayers = [
      {
        id: "verbundskarte",
        source: "tarifverbundkarte",
        "source-layer": "ch.sbb.tarifverbundkarte",
        type: "fill",
        paint: {
          "fill-opacity": 0,
        },
      },
      {
        id: "verbundskarte.zpass",
        source: "tarifverbundkarte",
        "source-layer": "ch.sbb.tarifverbundkarte.zpass",
        type: "fill",
        paint: {
          "fill-opacity": 0,
        },
      },
      {
        id: "verbundskarte.zonen",
        source: "tarifverbundkarte",
        "source-layer": "ch.sbb.tarifverbundkarte.zonen",
        type: "fill",
        paint: {
          "fill-opacity": 0,
        },
      },
    ];
    const children = [
      // Layer for feature highlighting on click
      new VectorLayer({
        olLayer: new OLVectorLayer({
          source: new VectorSource(),
        }),
        properties: {
          hideInLegend: true,
        },
      }),
    ];
    super({ ...options, styleLayers, children });
    this.selectedZone = null;
    this.highlightSource = this.children[0].olLayer.getSource(); // Get vector layer source
  }

  /**
   * @override
   */
  attachToMap(map) {
    super.attachToMap(map);
    this.olListenersKeys.push(
      this.map.on("singleclick", (e) => this.selectZone(e)), // Add click listener
    );
  }

  /**
   * @override
   */
  detachFromMap(map) {
    // Remove selected feature on detachFromMap
    this.removeSelection();
    super.detachFromMap(map);
  }

  selectZone(e) {
    // Remove previous selection
    this.removeSelection();

    // Select new zone
    this.getFeatureInfoAtCoordinate(e.coordinate).then((data) => {
      const [feature] = data.features; // Municipality feature containing the zone objects in the properties
      const zones = feature?.get("zones");

      if (!feature || !zones?.length) {
        // Abort if no zone or feature present
        return null;
      }

      /**
       * If multiple zones present, the zones are intersected with one another and the municipality feature
       */
      const featCollection = format.writeFeaturesObject([
        ...zones.map((zone) => new Feature(zone.geometry)),
        feature,
      ]);
      const finalIntersection = intersect(featCollection);

      if (finalIntersection) {
        // Create and highlight ol feature, add properties for use in popup
        const highlightedFeature = format.readFeature(finalIntersection);
        highlightedFeature.setStyle(
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
        this.highlightSource.addFeature(highlightedFeature);
        this.selectedZone = highlightedFeature;
      } else {
        // If we click in the middle of 3 zones, intersectedZones or finalIntersection could be null then the app crashed.
        // ex click at the intersection of  Vitnau, Gersau and Rigi scheidegg zones.
        // --> ?lang=de&layers=&x=926439.62&y=5959367.46&z=10.46
        this.selectedZone = null;
        this.highlightSource.clear();
      }

      /**
       * Signals to the popup (if there is one open) that a feature was clicked.
       * Used for popup close handling
       * @ignore
       */
      this.set("clicked", true);

      return null;
    });
  }

  removeSelection() {
    // Remove previous selection
    if (
      this.selectedZone &&
      this.highlightSource.hasFeature(this.selectedZone)
    ) {
      this.highlightSource.clear();
      this.selectedZone = null;
    }
  }

  getFeatureInfoAtCoordinate(coordinate) {
    return super.getFeatureInfoAtCoordinate(coordinate).then((data) => {
      const featureInfo = { ...data };
      const municipalityFeature = featureInfo.features.find(
        (feat) => feat.get("source") === "verbund",
      );

      /**
       * We omit getFeatureInfo if:
       * - There is no feature in verbundskarte layer (in some places the other two layers overlap with overflow)
       * - There is a feature in verbundskarte layer, but no zones and no z-pass features
       * @ignore
       */
      if (!municipalityFeature) {
        featureInfo.features = [];
        return featureInfo;
      }

      // If zones present and the municipality has a 'partners' attribute we store the zone in the municipality feature
      const zoneFeatures = featureInfo.features.filter(
        (feat) =>
          feat.get("zone") &&
          feat.get("verbund") &&
          !/^Z-Pass/.test(feat.get("verbund")),
      );

      if (zoneFeatures[0] && !!municipalityFeature.get("partners").trim()) {
        const zones = zoneFeatures.map((zone) => zone.getProperties());
        const cleanedZones = [
          ...new Map(zones.map((zone) => [zone.verbund, zone])).values(), // Remove duplicates
        ];
        municipalityFeature.set("zones", cleanedZones);
      }

      // Extract z-Pass and store in the municipality feature
      const zPassFeature = featureInfo.features.find(
        (feat) => feat.get("source") === "z-pass",
      );

      if (zPassFeature) {
        municipalityFeature.set("zPass", zPassFeature.getProperties());
      }

      // Return only municipality feature to prevent multiple feature info and popup pagination
      featureInfo.features = [municipalityFeature];
      return featureInfo;
    });
  }
}

export default TarifverbundkarteLayer;
