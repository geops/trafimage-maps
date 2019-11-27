/* eslint-disable no-param-reassign */
import Layer from 'react-spatial/layers/Layer';

/**
 * Apply visibility to style layers that fits the filter function.
 * @private
 */
const applyLayoutVisibility = (mbMap, visible, filterFunc) => {
  const style = mbMap.getStyle();

  if (!mbMap || !style) {
    return;
  }

  if (filterFunc) {
    const visibilityValue = visible ? 'visible' : 'none';
    for (let i = 0; i < style.layers.length; i += 1) {
      const styleLayer = style.layers[i];
      if (filterFunc(styleLayer)) {
        if (mbMap.getLayer(styleLayer.id)) {
          mbMap.setLayoutProperty(styleLayer.id, 'visibility', visibilityValue);
        }
      }
    }
  }
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
    this.addStyleLayers = this.addStyleLayers.bind(this);

    if (!this.styleLayersFilter && this.styleLayers) {
      const ids = this.styleLayers.map(s => s.id);
      this.styleLayersFilter = styleLayer => {
        return ids.includes(styleLayer.id);
      };
    }

    this.actions = [];
  }

  addStyleLayers() {
    const { mbMap } = this.mapboxLayer;
    this.styleLayers.forEach(styleLayer => {
      if (!mbMap.getLayer(styleLayer.id)) {
        mbMap.addLayer(styleLayer);
      }
      applyLayoutVisibility(mbMap, this.getVisible(), this.styleLayersFilter);
    });
  }

  init(map) {
    super.init(map);

    // Apply the initial visibiltity.
    const { mbMap } = this.mapboxLayer;
    if (!mbMap) {
      return;
    }

    if (mbMap.isStyleLoaded()) {
      this.isMbMapLoaded = true;
      this.addStyleLayers();
    } else {
      mbMap.once('load', () => {
        this.isMbMapLoaded = true;
        this.addStyleLayers();
      });
    }

    // Apply the visibiltity when layer's visibility change.
    this.olListenersKeys.push(
      this.on('change:visible', ({ target: layer }) => {
        if (this.isMbMapLoaded) {
          // Once the map is loaded we can apply vsiiblity without waiting
          // the style. Mapbox take care of the application of style changes.
          applyLayoutVisibility(
            mbMap,
            layer.getVisible(),
            this.styleLayersFilter,
          );
        }
      }),
    );

    this.olListenersKeys.push(
      this.mapboxLayer.on('change:styleurl', this.addStyleLayers),
    );
  }

  terminate(map) {
    const { mbMap } = this.mapboxLayer;
    if (mbMap && mbMap.isStyleLoaded() && this.styleLayers) {
      this.styleLayers
        .map(s => s.id)
        .forEach(styleLayerId => {
          if (mbMap.getLayer(styleLayerId)) {
            mbMap.removeLayer(styleLayerId);
          }
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
    const { mbMap } = this.mapboxLayer;
    // Ignore the getFeatureInfo until the mapbox map is loaded
    if (!mbMap || !mbMap.isStyleLoaded()) {
      return Promise.resolve({ coordinate, features: [], layer: this });
    }
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

  getFeatures() {
    const { mbMap } = this.mapboxLayer;
    // Ignore the getFeatureInfo until the mapbox map is loaded
    if (!mbMap || !mbMap.isStyleLoaded()) {
      return [];
    }

    return mbMap.querySourceFeatures(
      this.styleLayers.map(s => s && s.source),
      {
        sourceLayer: this.styleLayers.map(s => s && s['source-layer']),
        // filter: e => e,
        validate: false,
      },
    );
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
