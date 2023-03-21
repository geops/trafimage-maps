import MapboxStyleLayer from '../MapboxStyleLayer';

// const VIAPOINTSLAYER_ID = 'dv_points';
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
        return (
          mapboxFeature &&
          !/outline/.test(mapboxFeature.layer.id) &&
          !/highlight/.test(mapboxFeature.layer.id)
        );
      },
      styleLayersFilter: (layer) => {
        const regex = new RegExp(`^ipv_${this.get('routeType')}$`, 'i');
        return layer.metadata && regex.test(layer.metadata['trafimage.filter']);
      },
    });
    this.useDvPoints = options.properties.useDvPoints !== false;
  }

  onLoad() {
    this.onChangeVisible(this.visible);
    super.onLoad();
  }

  onChangeVisible(visible) {
    const nightLayer = this.get('nightLayer');
    const dayLayer = this.get('dayLayer');
    const otherLayer = nightLayer || dayLayer;

    if (visible && otherLayer?.get('visible')) {
      this.handleVisiblilityChange(['ipv_all']);
    } else if (visible && !otherLayer?.get('visible')) {
      this.handleVisiblilityChange([`ipv_${this.get('routeType')}`]);
    } else if (!visible && otherLayer?.get('visible')) {
      this.handleVisiblilityChange([`ipv_${otherLayer.get('routeType')}`]);
    } else {
      this.handleVisiblilityChange([]);
    }
    if (!visible) {
      this.select();
    }
  }

  handleVisiblilityChange(trafimageFilterArray = []) {
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    console.log(trafimageFilterArray);
    const style = mbMap.getStyle();
    const ipvLayers = style.layers.filter((stylelayer) => {
      return /^ipv_(day|night|all)$/.test(
        stylelayer.metadata && stylelayer.metadata['trafimage.filter'],
      );
    });
    ipvLayers.forEach((stylelayer) => {
      const filter =
        stylelayer.metadata && stylelayer.metadata['trafimage.filter'];
      console.log(trafimageFilterArray.includes(filter) ? 'visible' : 'none');
      mbMap.setLayoutProperty(
        stylelayer.id,
        'visibility',
        trafimageFilterArray.includes(filter) ? 'visible' : 'none',
      );
    });
    console.log(ipvLayers);
  }

  /**
   * @override
   */
  attachToMap(map) {
    super.attachToMap(map);
    this.olListenersKeys.push(
      this.on('change:visible', (evt) => {
        this.onChangeVisible(!evt.oldValue);
      }),
    );
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
