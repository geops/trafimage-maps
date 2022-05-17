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

    if (!this.styleLayersFilter) {
      return;
    }
    for (let i = 0; i < style.layers.length; i += 1) {
      const styleLayer = style.layers[i];
      // Return the value of the metadata geops.filter. if it exists.
      const metadata = this.styleLayersFilter(styleLayer);
      if (!metadata) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Store the initial filter value
      if (!filterCache[styleLayer.id]) {
        filterCache[styleLayer.id] = [...styleLayer.filter];
      }

      // level 2D
      if (metadata === '2D' && this.level === '2D') {
        if (visible && styleLayer.layout.visibility === 'none') {
          mbMap.setLayoutProperty(styleLayer.id, 'visibility', 'visible');
        } else if (!visible && styleLayer.layout.visibility === 'visible') {
          mbMap.setLayoutProperty(styleLayer.id, 'visibility', 'none');
        }

        // others levels
      } else if (metadata === 'level' && this.level !== '2D') {
        // If visible apply the new level filter.
        if (visible) {
          const currentFilter = [...filterCache[styleLayer.id]];
          currentFilter[1] = [
            '==',
            ['case', ['has', 'level'], ['get', 'level'], 0],
            this.level,
          ];

          mbMap.setFilter(styleLayer.id, currentFilter);

          if (styleLayer.layout.visibility === 'none') {
            mbMap.setLayoutProperty(styleLayer.id, 'visibility', 'visible');
          }
        } else if (!isInit && styleLayer.layout.visibility === 'visible') {
          // We set the visibility to none only if others siblings level layer are also hidden.
          if (
            !this.get('parent').children.find(
              (child) => child.level !== '2D' && child.visible,
            )
          ) {
            mbMap.setLayoutProperty(styleLayer.id, 'visibility', 'none');
          }
        }
      }
    }
  }
}

export default LevelLayer;
