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
    const tarifverbundskarteSourceId = 'verbundskarte-source';
    const styleLayers = [
      {
        id: 'verbundskarte',
        source: tarifverbundskarteSourceId,
        'source-layer': 'ch.sbb.tarifverbundkarte',
        type: 'fill',
        paint: {
          'fill-color': '#8cb22a',
        },
      },
      {
        id: 'verbundskarte.zonen',
        source: tarifverbundskarteSourceId,
        'source-layer': 'ch.sbb.tarifverbundkarte.zonen',
        type: 'fill',
        paint: {
          'fill-color': '#ead267',
        },
      },
      {
        id: 'verbundskarte.zpass',
        source: tarifverbundskarteSourceId,
        'source-layer': 'ch.sbb.tarifverbundkarte.zpass',
        type: 'fill',
        paint: {
          'fill-color': '#0ef783',
        },
      },
    ];
    super({
      ...options,
      styleLayers,
      queryRenderedLayersFilter: ({ id }) => {
        return id.includes('verbundskarte');
      },
    });

    this.zonesSource = {
      id: tarifverbundskarteSourceId,
      type: 'vector',
      url: 'https://maps.style-dev.geops.io/data/ch.sbb.tarifverbundkarte.json',
    };
  }

  /**
   * On Mapbox map load callback function. Add style sources then style layers.
   * @override
   */
  onLoad() {
    this.addSources();
    super.onLoad();
  }

  // Add sources for features using clustering and for highligting.
  addSources() {
    if (!this.mapboxLayer.mbMap) {
      return;
    }
    const { mbMap } = this.mapboxLayer;

    [this.zonesSource].forEach((source) => {
      const { id } = source;
      if (!mbMap.getSource(id)) {
        const withoutId = { ...source };
        delete withoutId.id;
        mbMap.addSource(id, withoutId);
      }
    });
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
       * - There is no feature in verbundskarte layer, but no zones and no z-pass features
       */
      if (featureInfo.features.length <= 1 || !verbundFeature) {
        featureInfo.features = [];
        return featureInfo;
      }

      const zoneFeature = featureInfo.features.find(
        (feat) => feat.get('zone') && feat.get('zoneplan'),
      );

      const zPassFeature = featureInfo.features.find(
        (feat) => feat.get('source') === 'z-pass',
      );

      if (zoneFeature) {
        verbundFeature.set('zone', zoneFeature.getProperties());
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
