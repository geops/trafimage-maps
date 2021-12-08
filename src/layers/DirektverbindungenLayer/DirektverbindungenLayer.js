import MapboxStyleLayer from '../MapboxStyleLayer';

const VIAPOINTSLAYER_ID = 'dv_points';
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
      featureInfoFilter: (feature) => {
        const mapboxFeature = feature.get('mapboxFeature');
        return mapboxFeature && !/outline/.test(mapboxFeature.layer.id);
      },
      styleLayersFilter: (layer) => {
        return (
          // !/outline/.test(layer.id) &&
          layer.metadata &&
          layer.metadata['trafimage.filter'] ===
            `lines_${this.get('routeType')}`
        );
      },
    });
  }

  onLoad() {
    if (!this.originalColor) {
      this.originalColor = {};
    }

    if (!this.originalLineWidth) {
      this.originalLineWidth = {};
    }

    const { mbMap } = this.mapboxLayer;
    this.osmPointsLayers = mbMap
      .getStyle()
      .layers.filter((layer) => {
        return this.styleLayersFilter(layer); // && /outline/.test(layer.id);
      })
      .forEach((layer) => {
        const layerId = layer.id;
        if (!this.originalColor[layerId]) {
          this.originalColor[layerId] = layer.paint['line-color'];
          this.originalLineWidth[layerId] = layer.paint['line-width'];

          // We retrieve the colro and save it to use it in the popup.
          this.set('color', this.originalColor[layerId]);
          // mbMap.setPaintProperty(`${layerId}_oultine_1`, 'line-width', [
          //   'case',
          //   ['boolean', ['feature-state', 'hover'], false],
          //   this.originalLineWidth[layerId] * 2, // (this.get('routeType') === 'day' ? 3 : 4),
          //   this.originalLineWidth[layerId],
          // ]);
          // mbMap.setPaintProperty(`${layerId}_oultine_2`, 'line-width', [
          //   'case',
          //   ['boolean', ['feature-state', 'hover'], false],
          //   this.originalLineWidth[layerId] * 2, // (this.get('routeType') === 'day' ? 3 : 4),
          //   this.originalLineWidth[layerId],
          // ]);
          mbMap.setPaintProperty(layerId, 'line-width', [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            this.originalLineWidth[layerId] * (/outline/.test(layerId) ? 3 : 2), // (this.get('routeType') === 'day' ? 3 : 4),
            this.originalLineWidth[layerId],
          ]);
          // mbMap.setPaintProperty(layerId, 'line-color', [
          //   'case',
          //   ['boolean', ['feature-state', 'hover'], false],
          //   lighten(this.originalColor[layerId], 0.5),
          //   this.originalColor[layerId],
          // ]);
        }
        // mbMap.setPaintProperty(layerId, 'line-color', [
        //   'case',
        //   ['boolean', ['feature-state', 'hover'], false],
        //   'red',
        //   'green',
        // ]);
        // this.setHoverState(features, true);
        // console.log(features[0].get('mapboxFeature'));
      });

    // this.addSource();
    super.onLoad();
    // this.updateSource();
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
    if (!mbMap) {
      return;
    }
    super.select(features);
    mbMap.setLayoutProperty(VIAPOINTSLAYER_ID, 'visibility', 'visible');
    if (mbMap) {
      if (this.selectedFeatures.length) {
        this.selectedFeatures.forEach((feature) => {
          mbMap.setFilter(VIAPOINTSLAYER_ID, [
            '==',
            ['get', 'direktverbindung_id'],
            feature.get('id'),
          ]);
        });
        mbMap.setLayoutProperty(VIAPOINTSLAYER_ID, 'visibility', 'visible');
        mbMap.setPaintProperty(
          VIAPOINTSLAYER_ID,
          'circle-stroke-color',
          this.get('routeType') === 'night'
            ? 'rgba(5, 21, 156, 1)'
            : 'rgba(9, 194, 242, 1)',
        );
      } else {
        mbMap.setFilter(VIAPOINTSLAYER_ID, null);
        mbMap.setLayoutProperty(VIAPOINTSLAYER_ID, 'visibility', 'none');
      }
    }
  }
}

export default DirektverbindungenLayer;
