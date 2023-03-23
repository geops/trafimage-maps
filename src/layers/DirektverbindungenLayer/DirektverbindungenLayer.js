import { GeoJSON } from 'ol/format';
import MapboxStyleLayer from '../MapboxStyleLayer';
import getTrafimageFilter from '../../utils/getTrafimageFilter';

const IPV_REGEX = /^ipv_(day|night|all)$/;

const setFakeFeatProps = (feat) => {
  feat.setProperties({
    ...feat.getProperties(),
    name: 'Old road to The Shire',
    start_station_name: 'Minas Tirith, Gondor',
    end_station_name: 'Bagend, The Shire',
    vias: [
      {
        via_type: 'start',
        station_name: 'Minas Tirith, Gondor',
        didok: '8501120',
        coordinates: [737947, 5863556],
      },
      ...Array.from(Array(Math.floor(Math.random() * 15))).map((f, idx) => ({
        via_type: 'visible',
        station_name: `Isengard, Rohan (${idx})`,
        didok: '8501125',
        coordinates: [737947, 5863556],
      })),
      {
        via_type: 'end',
        station_name: 'Bagend, The Shire',
        didok: '8768634',
        coordinates: [264219, 6248583],
      },
    ],
    description_de: 'This is the path the four hobbits took at the end of LOTR',
    description_en: 'This is the path the four hobbits took at the end of LOTR',
    description_it: 'This is the path the four hobbits took at the end of LOTR',
    description_fr: 'This is the path the four hobbits took at the end of LOTR',
    url_de: 'https://example.com/',
    url_en: 'https://example.com/',
    url_it: 'https://example.com/',
    url_fr: 'https://example.com/',
  });
  return feat;
};
/**
 * Layer for visualizing station levels.
 *
 * @class
 * @param {Object} [options] Layer options.
 * @inheritdoc
 * @private
 */

class DirektverbindungenLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super({
      ...options,
      queryRenderedLayersFilter: (layer) => {
        return (
          IPV_REGEX.test(getTrafimageFilter(layer)) &&
          layer['source-layer'] === 'ch.sbb.direktverbindungen_edges'
        );
      },
      styleLayersFilter: (layer) => {
        return IPV_REGEX.test(getTrafimageFilter(layer));
      },
    });
  }

  onLoad() {
    super.onLoad();
    this.onChangeVisible();
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      const allIpvFeaturesGeoJSON = mbMap.querySourceFeatures(
        'ch.sbb.direktverbindungen',
      );

      const olFeatures = new GeoJSON().readFeatures({
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3857',
          },
        },
        features: allIpvFeaturesGeoJSON,
      });
      this.allLines = olFeatures.map(setFakeFeatProps);
    }
  }

  getCurrentFilter() {
    const nightLayer = this.get('nightLayer');
    const dayLayer = this.get('dayLayer');

    if (dayLayer?.get('visible') && nightLayer?.get('visible')) {
      return 'ipv_all';
    }
    if (dayLayer?.get('visible') || nightLayer?.get('visible')) {
      const visibleLayer = [dayLayer, nightLayer].find((layer) =>
        layer.get('visible'),
      );
      return `ipv_${visibleLayer.get('routeType')}`;
    }
    return null;
  }

  onChangeVisible() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    const style = mbMap.getStyle();
    const currentFilter = this.getCurrentFilter();
    const ipvLayers = style?.layers.filter((stylelayer) => {
      return IPV_REGEX.test(getTrafimageFilter(stylelayer));
    });
    ipvLayers.forEach((stylelayer) => {
      mbMap.setLayoutProperty(
        stylelayer.id,
        'visibility',
        getTrafimageFilter(stylelayer) === currentFilter ? 'visible' : 'none',
      );
    });
  }

  getFeatureInfoAtCoordinate(coordinate, options) {
    return super
      .getFeatureInfoAtCoordinate(coordinate, options)
      .then((featureInfo) => {
        // TODO: Hardcoded test data, remove when data is updated
        // eslint-disable-next-line no-param-reassign
        featureInfo.features = featureInfo.features.map((feat) => {
          feat.setProperties({
            ...feat.getProperties(),
            name: 'Old road to The Shire',
            start_station_name: 'Minas Tirith, Gondor',
            end_station_name: 'Bagend, The Shire',
            vias: [
              {
                via_type: 'start',
                station_name: 'Minas Tirith, Gondor',
                didok: '8501120',
                coordinates: [737947, 5863556],
              },
              ...Array.from(Array(Math.floor(Math.random() * 15))).map(
                (f, idx) => ({
                  via_type: 'visible',
                  station_name: `Isengard, Rohan (${idx})`,
                  didok: '8501125',
                  coordinates: [737947, 5863556],
                }),
              ),
              {
                via_type: 'end',
                station_name: 'Bagend, The Shire',
                didok: '8768634',
                coordinates: [264219, 6248583],
              },
            ],
            description_de:
              'This is the path the four hobbits took at the end of LOTR',
            description_en:
              'This is the path the four hobbits took at the end of LOTR',
            description_it:
              'This is the path the four hobbits took at the end of LOTR',
            description_fr:
              'This is the path the four hobbits took at the end of LOTR',
            url_de: 'https://example.com/',
            url_en: 'https://example.com/',
            url_it: 'https://example.com/',
            url_fr: 'https://example.com/',
          });
          return feat;
        });
        return featureInfo;
      });
  }

  select(features = []) {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    super.select(features);
    // if (this.useDvPoints) {
    //   mbMap.setLayoutProperty(VIAPOINTSLAYER_ID, 'visibility', 'visible');
    //   if (mbMap) {
    //     if (this.selectedFeatures.length) {
    //       this.selectedFeatures.forEach((feature) => {
    //         mbMap.setFilter(VIAPOINTSLAYER_ID, [
    //           '==',
    //           ['get', 'direktverbindung_id'],
    //           feature.get('id'),
    //         ]);
    //       });
    //       mbMap.setLayoutProperty(VIAPOINTSLAYER_ID, 'visibility', 'visible');
    //       mbMap.setPaintProperty(
    //         VIAPOINTSLAYER_ID,
    //         'circle-stroke-color',
    //         this.get('routeType') === 'night'
    //           ? 'rgba(5, 21, 156, 1)'
    //           : 'rgba(9, 194, 242, 1)',
    //       );
    //     } else {
    //       mbMap.setFilter(VIAPOINTSLAYER_ID, null);
    //       mbMap.setLayoutProperty(VIAPOINTSLAYER_ID, 'visibility', 'none');
    //     }
    //   }
    // }
  }
}

export default DirektverbindungenLayer;
