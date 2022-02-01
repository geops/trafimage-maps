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
 * @private
 */
class LevelLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    super(options);
    this.level = options.level;
  }

  /**
   * Apply visibility to style layers that fits the filter function.
   */
  applyLayoutVisibility(evt) {
    const { visible } = this;
    const { mbMap } = this.mapboxLayer;
    const style = mbMap.getStyle();

    if (!mbMap || !style) {
      return;
    }

    const isInit = !evt;

    if (this.styleLayersFilter) {
      for (let i = 0; i < style.layers.length; i += 1) {
        const styleLayer = style.layers[i];
        // Return the value of the metadata geops.filter. if it exists.
        const metadata = this.styleLayersFilter(styleLayer);
        if (metadata) {
          if (!filterCache[styleLayer.id]) {
            filterCache[styleLayer.id] = [...styleLayer.filter];
          }
          const currentFilter = [...styleLayer.filter] || [];

          if (metadata === 'level' && this.level !== '2D') {
            if (visible) {
              currentFilter[1] = [
                '==',
                ['case', ['has', 'level'], ['get', 'level'], 0],
                this.level,
              ];

              // If visible and isInit, set the newfilter
              // if not visible and not initializing, reset the original one.
              if (
                (!isInit && (!visible || filterCache[styleLayer.id])) ||
                (isInit && visible)
              ) {
                mbMap.setFilter(
                  styleLayer.id,
                  visible ? currentFilter : filterCache[styleLayer.id],
                );

                if (styleLayer.layout.visibility === 'none') {
                  mbMap.setLayoutProperty(
                    styleLayer.id,
                    'visibility',
                    'visible',
                  );
                }
              }
            } else if (!isInit && styleLayer.layout.visibility === 'visible') {
              mbMap.setLayoutProperty(styleLayer.id, 'visibility', 'none');
            }
          } else if (metadata === '2D' && this.level === '2D') {
            if (this.level === metadata && visible) {
              if (styleLayer.layout.visibility === 'none') {
                mbMap.setLayoutProperty(styleLayer.id, 'visibility', 'visible');
              }
            } else if (styleLayer.layout.visibility === 'visible' && !visible) {
              mbMap.setLayoutProperty(styleLayer.id, 'visibility', 'none');
            }
          }
        }
      }
    }
  }
}

export default LevelLayer;
