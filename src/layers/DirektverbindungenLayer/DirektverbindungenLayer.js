import { GeoJSON } from 'ol/format';
import { LineString } from 'ol/geom';
import MapboxStyleLayer from '../MapboxStyleLayer';
import getTrafimageFilter from '../../utils/getTrafimageFilter';
import { getId } from '../../utils/removeDuplicateFeatures';

const IPV_REGEX = /^ipv_((trip|call)_)?(day|night|all)$/;
const IPV_TRIP_REGEX = /^ipv_trip_(day|night|all)$/;

const setFakeFeatProps = (feat) => {
  feat.setProperties({
    ...feat.getProperties(),
    vias: [
      {
        via_type: 'start',
        station_name: feat.getProperties().start_station_name,
        didok: '8501120',
        coordinates: [737947, 5863556],
      },
      ...Array.from(Array(Math.floor(Math.random() * 15))).map((f, idx) => ({
        via_type: 'visible',
        station_name: `Zwischenhalt ${idx + 1}`,
        didok: '8501125',
        coordinates: [737947, 5863556],
      })),
      {
        via_type: 'end',
        station_name: feat.getProperties().end_station_name,
        didok: '8768634',
        coordinates: [264219, 6248583],
      },
    ],
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
      queryRenderedLayersFilter: (layer) =>
        IPV_TRIP_REGEX.test(getTrafimageFilter(layer)),
      styleLayersFilter: (layer) => {
        return IPV_TRIP_REGEX.test(getTrafimageFilter(layer));
      },
      featureInfoFilter: (feat) => feat.getGeometry() instanceof LineString,
    });
  }

  onLoad() {
    super.onLoad();
    this.onChangeVisible();
  }

  getIpvFeatures() {
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      const allIpvFeaturesGeoJSON = mbMap.querySourceFeatures(
        'ch.sbb.direktverbindungen',
        {
          sourceLayer: 'ch.sbb.direktverbindungen_trips',
          filter: ['==', '$type', 'LineString'],
        },
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
      olFeatures.forEach((feat) => {
        setFakeFeatProps(feat);
        feat.set(
          'mapboxFeature',
          allIpvFeaturesGeoJSON.find((mbFeat) => mbFeat.id === getId(feat)),
        );
      });
      return olFeatures;
    }
    // eslint-disable-next-line no-console
    console.error(`Mapbox map not loaded`);
    return [];
  }

  getIpvLayers() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return null;
    }
    const style = mbMap.getStyle();
    return style?.layers.filter((stylelayer) => {
      return IPV_REGEX.test(getTrafimageFilter(stylelayer));
    });
  }

  /** Returns a string: 'day', 'night' or 'all' */
  getCurrentLayer() {
    const nightLayer = this.get('nightLayer');
    const dayLayer = this.get('dayLayer');

    if (dayLayer?.get('visible') && nightLayer?.get('visible')) {
      return 'all';
    }
    if (dayLayer?.get('visible') || nightLayer?.get('visible')) {
      const visibleLayer = [dayLayer, nightLayer].find((layer) =>
        layer.get('visible'),
      );
      return visibleLayer.get('routeType');
    }
    return null;
  }

  select(features) {
    super.select(features);
  }

  onChangeVisible() {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    const ipvLayers = this.getIpvLayers();
    const currentLayer = this.getCurrentLayer();
    const filterRegex = new RegExp(`^ipv_(trip_)?(${currentLayer})$`);
    ipvLayers?.forEach((stylelayer) => {
      mbMap.setLayoutProperty(
        stylelayer.id,
        'visibility',
        filterRegex.test(getTrafimageFilter(stylelayer)) ? 'visible' : 'none',
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
          setFakeFeatProps(feat);
          return feat;
        });
        return featureInfo;
      });
  }
}

export default DirektverbindungenLayer;
