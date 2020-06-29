/* eslint-disable no-param-reassign */
import MapboxStyleLayer from '../MapboxStyleLayer';

// Caching filters to reset to the original when toggle off the layer.
const filterCache = {};
/**
 * Layer for visualizing station levels.
 *
 * @class
 * @param {Object} [options] Layer options.
 * @inheritdoc
 */
class LevelLayer extends MapboxStyleLayer {
  /**
   * Apply visibility to style layers that fits the filter function.
   */
  applyLayoutVisibility() {
    const visible = this.getVisible();
    const { mbMap } = this.mapboxLayer;
    const style = mbMap.getStyle();

    if (!mbMap || !style) {
      return;
    }

    if (this.styleLayersFilter) {
      for (let i = 0; i < style.layers.length; i += 1) {
        const styleLayer = style.layers[i];
        if (this.styleLayersFilter(styleLayer)) {
          if (!filterCache[styleLayer.id]) {
            filterCache[styleLayer.id] = [...styleLayer.filter];
          }
          let currentFilter = [...styleLayer.filter] || [];

          if (styleLayer.id === 'poi_with_icons') {
            // Use case filter to use poi with level field for level 0.
            currentFilter[1] = [
              '==',
              ['case', ['has', 'level'], ['get', 'level'], 0],
              this.filters[2],
            ];
          } else if (
            /stationFocus_base_shadow|^stationFocus_base$/.test(styleLayer.id)
          ) {
            // Overwrite the nested filter value of: ['==', 'level', val]
            currentFilter[1] = this.filters;
          } else {
            // Overwrite the filter value of: ['==', 'level', val]
            currentFilter = [...currentFilter, this.filters].filter((f) => {
              if (f[0] === '==' && f[1] === 'level') {
                return f[2] === this.filters[2];
              }
              return true;
            });
          }

          // If visible set the newfilter, if not visible, reset the original one.
          if (visible || filterCache[styleLayer.id]) {
            mbMap.setFilter(
              styleLayer.id,
              visible ? currentFilter : filterCache[styleLayer.id],
            );
          }
        }
      }
    }
  }
}

export default LevelLayer;
