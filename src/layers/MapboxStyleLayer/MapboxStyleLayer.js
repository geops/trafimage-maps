/* eslint-disable no-param-reassign */
import Layer from 'react-spatial/layers/Layer';

/**
 * Apply visibility to style layers that fits the filter function.
 */
const applyVisibilityToStyleLayer = (styleLayer, visibilityValue) => {
  styleLayer.layout = styleLayer.layout || {};
  styleLayer.layout.visibility = visibilityValue;
};

/**
 * Apply visibility to style layers that fits the filter function.
 */
const applyVisibility = (mbMap, visible, filterFunc) => {
  const styleObj = mbMap.getStyle();
  if (!mbMap && styleObj) {
    return;
  }
  const visibilityValue = visible ? 'visible' : 'none';
  if (filterFunc) {
    for (let i = 0; i < styleObj.layers.length; i += 1) {
      const styleObjLayer = styleObj.layers[i];
      if (filterFunc(styleObjLayer)) {
        applyVisibilityToStyleLayer(styleObjLayer, visibilityValue);
      }
    }
  }
  mbMap.setStyle(styleObj);
};

/**
 * Layer for visualizing information about stations (default) or airports.
 * The popup contains links to station plans, station coordinates
 * and links to timetable, services, shopping, handicap information.
 *
 * <img src="img/layers/NetzkartePointLayer/layer.png" alt="Layer preview" title="Layer preview">
 *
 * Extends {@link https://react-spatial.geops.de/docjs.html#mapboxlayer geops-spatial/layers/MapboxLayer}
 * @class
 * @param {Object} [options] Layer options.
 * @inheritdoc
 */
class MapboxStyleLayer extends Layer {
  constructor(options = {}) {
    super(options);

    this.mapboxLayer = options.mapboxLayer;
    this.styleLayersFilter = options.styleLayersFilter;
    this.featureInfoFilter = options.featureInfoFilter || (obj => obj);
    this.highlightedFeatures = [];
    this.selectedFeatures = [];
    this.styleLayers =
      (options.styleLayer ? [options.styleLayer] : options.styleLayers) || [];

    if (!this.styleLayersFilter && this.styleLayers) {
      const ids = this.styleLayers.map(s => s.id);
      this.styleLayersFilter = styleLayer => {
        return ids.includes(styleLayer.id);
      };
    }
  }

  init(map) {
    super.init(map);

    // Apply the initial visibiltity.
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }
    if (mbMap.isStyleLoaded()) {
      if (this.styleLayers) {
        this.styleLayers.forEach(styleLayer => {
          mbMap.addLayer(styleLayer);
        });
        applyVisibility(mbMap, this.getVisible(), this.styleLayersFilter);
      }
      applyVisibility(mbMap, this.getVisible(), this.styleLayersFilter);
    } else {
      const onStyleData = () => {
        if (this.styleLayers) {
          this.styleLayers.forEach(styleLayer => {
            applyVisibilityToStyleLayer(
              styleLayer,
              this.getVisible() ? 'visible' : 'none',
            );
            mbMap.addLayer(styleLayer);
          });
        }
        applyVisibility(mbMap, this.getVisible(), this.styleLayersFilter);
        mbMap.off('styledata', onStyleData);
      };
      mbMap.on('styledata', onStyleData);
    }

    // Apply the visibiltity when layer's visibility change.
    this.olListenersKeys.push(
      this.on('change:visible', ({ target: layer }) => {
        applyVisibility(mbMap, layer.getVisible(), this.styleLayersFilter);
      }),
    );
  }

  terminate(map) {
    const { mbMap } = this.mapboxLayer;
    if (mbMap && mbMap.isStyleLoaded() && this.styleLayers) {
      this.styleLayers
        .map(s => s.id)
        .forEach(styleLayerId => {
          mbMap.removeLayer(styleLayerId);
        });
    }
    super.terminate(map);
  }

  /**
   * Request feature information for a given coordinate.
   * @param {ol.Coordinate} coordinate Coordinate to request the information at.
   * @returns {Promise<Object>} Promise with features, layer and coordinate
   *  or null if no feature was hit.
   */
  getFeatureInfoAtCoordinate(coordinate) {
    return this.mapboxLayer
      .getFeatureInfoAtCoordinate(coordinate, {
        layers: this.styleLayers.map(s => s && s.id),
        validate: false,
      })
      .then(featureInfo => {
        const features = featureInfo.features.filter(feature => {
          return this.featureInfoFilter(
            feature,
            this.map.getView().getResolution(),
          );
        });
        this.highlight(features);
        return { ...featureInfo, features, layer: this };
      });
  }

  setHoverState(features = [], state) {
    const options = this.styleLayers[0];
    features.forEach(feature => {
      if (!options.source || !options['source-layer'] || !feature.getId()) {
        return;
      }
      this.mapboxLayer.mbMap.setFeatureState(
        {
          id: feature.getId(),
          source: options.source,
          sourceLayer: options['source-layer'],
        },
        { hover: state },
      );
    });
  }

  select(features = []) {
    this.setHoverState(this.selectedFeatures, false);
    this.selectedFeatures = features;
    this.setHoverState(this.selectedFeatures, true);
  }

  highlight(features = []) {
    // Filter out selected features
    const filtered = this.highlightedFeatures.filter(feature => {
      return !this.selectedFeatures
        .map(feat => feat.getId())
        .includes(feature.getId());
    });

    // Remove previous highlight
    this.setHoverState(filtered, false);
    this.highlightedFeatures = features;

    // Add highlight
    this.setHoverState(this.highlightedFeatures, true);
  }
}

export default MapboxStyleLayer;
