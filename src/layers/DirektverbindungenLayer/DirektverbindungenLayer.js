/* eslint-disable no-param-reassign */
import MapboxStyleLayer from '../MapboxStyleLayer';

const VIAPOINTSLAYER_KEY = 'dv_points';
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
    super(options);
    this.routeType = options.routeType === 'night' ? 'night' : 'day';
    this.styleLayersFilter = (layer) => {
      return (
        layer.metadata &&
        layer.metadata['trafimage.filter'] ===
          `lines_${this.routeType === 'night' ? 'night' : 'day'}`
      );
    };
    this.featureInfoFilter = (feature) => {
      const mapboxFeature = feature.get('mapboxFeature');
      return mapboxFeature && !/outline/.test(mapboxFeature.layer.id);
    };
  }

  setVisible(
    visible,
    stopPropagationDown,
    stopPropagationUp,
    stopPropagationSiblings,
  ) {
    if (!visible) {
      this.select();
    }
    super.setVisible(
      visible,
      stopPropagationDown,
      stopPropagationUp,
      stopPropagationSiblings,
    );
  }

  init(map) {
    super.init(map);
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      mbMap.on('load', () =>
        mbMap.setPaintProperty(`dv_lines_${this.routeType}`, 'line-width', [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          8,
          2,
        ]),
      );
    }
  }

  select(features = []) {
    const { mbMap } = this.mapboxLayer;
    super.select(features);

    if (mbMap) {
      if (this.selectedFeatures.length) {
        this.selectedFeatures.forEach((feature) => {
          mbMap.setFilter(VIAPOINTSLAYER_KEY, [
            '==',
            ['get', 'route_id'],
            feature.get('id'),
          ]);
        });
        mbMap.setLayoutProperty(VIAPOINTSLAYER_KEY, 'visibility', 'visible');
        mbMap.setPaintProperty(
          VIAPOINTSLAYER_KEY,
          'circle-stroke-color',
          this.routeType === 'night'
            ? 'rgba(5, 21, 156, 1)'
            : 'rgba(9, 194, 242, 1)',
        );
      } else {
        mbMap.setFilter(VIAPOINTSLAYER_KEY, null);
        mbMap.setLayoutProperty(VIAPOINTSLAYER_KEY, 'visibility', 'none');
      }
    }
  }
}

export default DirektverbindungenLayer;
