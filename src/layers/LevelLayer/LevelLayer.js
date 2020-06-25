/* eslint-disable no-param-reassign */
import MapboxStyleLayer from '../MapboxStyleLayer';

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
  // eslint-disable-next-line class-methods-use-this
  applyLayoutVisibility(mbMap, visible, filterFunc, layerFilter, isRadio) {
    const style = mbMap.getStyle();

    if (!mbMap || !style || (isRadio && !visible)) {
      return;
    }

    if (filterFunc) {
      const visibilityValue = visible ? 'visible' : 'none';
      for (let i = 0; i < style.layers.length; i += 1) {
        const styleLayer = style.layers[i];
        if (filterFunc(styleLayer)) {
          mbMap.setLayoutProperty(styleLayer.id, 'visibility', visibilityValue);
          if (layerFilter) {
            let currentFilter = styleLayer.filter || [];

            if (visible && styleLayer && currentFilter.length) {
              if (styleLayer.id === 'poi_with_icons') {
                currentFilter[1] = [
                  '==',
                  ['case', ['has', 'level'], ['get', 'level'], 0],
                  layerFilter[0][2],
                ];
              } else if (
                /stationFocus_base_shadow|^stationFocus_base$/.test(
                  styleLayer.id,
                )
              ) {
                [currentFilter[1]] = layerFilter;
              } else if (!currentFilter.includes('all')) {
                currentFilter = ['all', currentFilter];
              }
            }
            const newFilters = visible
              ? [...currentFilter, ...layerFilter].filter((f) => {
                  if (f[0] === '==' && f[1] === 'level') {
                    // Remove if there is a ['==', 'level', x] filter with another value.
                    return f[2] === layerFilter[0][2];
                  }
                  return true;
                })
              : (currentFilter || []).filter((filter) => {
                  return layerFilter.find((f) => {
                    return JSON.stringify(filter) !== JSON.stringify(f);
                  });
                });
            mbMap.setFilter(
              styleLayer.id,
              newFilters.length ? newFilters : currentFilter,
            );
          }
        }
      }
    }
  }
}

export default LevelLayer;
