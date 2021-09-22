/* eslint-disable no-param-reassign */
import MapboxStyleLayer from '../MapboxStyleLayer';

const VIAPOINTSLAYER_KEY = 'ch.sbb.direktverbindungen.points';
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
    const routeType = options.routeType === 'night' ? 'night' : 'day';
    const viaPointsLayerId = `${VIAPOINTSLAYER_KEY}.${routeType}`;
    super({
      styleLayers: [
        {
          id: viaPointsLayerId,
          type: 'circle',
          source: 'ch.sbb.direktverbindungen',
          'source-layer': 'ch.sbb.direktverbindungen_points',
          metadata: {
            'trafimage.filter': 'via_points',
          },
          paint: {
            'circle-radius': 4,
            'circle-stroke-width': 2,
            'circle-stroke-color':
              routeType === 'night'
                ? 'rgba(5, 21, 156, 1)'
                : 'rgba(9, 194, 242, 1)',
            'circle-color': 'rgb(255,255,255)',
          },
          layout: {
            visibility: 'none',
          },
        },
      ],
      ...options,
    });

    this.viaPointsLayerId = viaPointsLayerId;
    this.routeType = routeType;
    this.styleLayersFilter = (layer) => {
      return (
        layer.metadata &&
        layer.metadata['trafimage.filter'] ===
          `lines_${options.routeType === 'night' ? 'night' : 'day'}`
      );
    };
    this.setHoverPaint = this.setHoverPaint.bind(this);
  }

  setHoverPaint() {
    const { mbMap } = this.mapboxLayer;
    mbMap.setPaintProperty(`lines_${this.routeType}`, 'line-width', [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      6,
      this.routeType === 'night' ? 2 : 4,
    ]);
    mbMap.setPaintProperty(`lines_${this.routeType}`, 'line-dasharray', [1]);
  }

  init(map) {
    super.init(map);
    const { mbMap } = this.mapboxLayer;
    if (mbMap) {
      mbMap.on('load', this.setHoverPaint);
    }
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

  select(features = []) {
    const { mbMap } = this.mapboxLayer;
    super.select(features);

    if (mbMap) {
      if (this.selectedFeatures.length) {
        this.selectedFeatures.forEach((feature) => {
          mbMap.setFilter(this.viaPointsLayerId, [
            '==',
            ['get', 'route_id'],
            feature.get('id'),
          ]);
        });
        mbMap.setLayoutProperty(this.viaPointsLayerId, 'visibility', 'visible');
      } else {
        mbMap.setFilter(this.viaPointsLayerId, null);
        mbMap.setLayoutProperty(this.viaPointsLayerId, 'visibility', 'none');
      }
    }
  }

  getFeatureInfoAtCoordinate(coordinate) {
    return super.getFeatureInfoAtCoordinate(coordinate).then((data) => {
      return {
        ...data,
        siblingLayer: this.siblingLayer,
      };
    });
  }
}

export default DirektverbindungenLayer;
