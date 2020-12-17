import { MapboxLayer } from 'mobility-toolbox-js/ol';
import getMapboxMapCopyrights from 'mobility-toolbox-js/common/utils/getMapboxMapCopyrights';
import { toLonLat } from 'ol/proj';

const applyFilters = (mbStyle, filters) => {
  const newStyle = { ...mbStyle };
  /* Apply filters, remove style layers */
  if (mbStyle && filters) {
    const layers = [];
    (filters || []).forEach((filter) => {
      const styleLayers = mbStyle.layers;
      for (let i = 0; i < styleLayers.length; i += 1) {
        const style = styleLayers[i];
        /* filter.include boolean determines if the identified
         * styleLayers or all others should be removed
         */
        const condition = filter.include
          ? filter.value.test(style[filter.field])
          : !filter.value.test(style[filter.field]);
        if (condition) {
          // mapboxStyle.layers.splice(i, 1);
          layers.push(mbStyle.layers[i]);
        }
      }
    });
    newStyle.layers = layers;
  }
  return newStyle;
};

class TrafimageMapboxLayer extends MapboxLayer {
  constructor(options) {
    super({ ...options, styleUrl: { version: 8, sources: {}, layers: [] } });
    this.filters = options.filters;
  }

  init(map) {
    super.init(map);

    if (this.map) {
      this.dispatchEvent({
        type: 'init',
        target: this,
      });
    }

    // Set zIndex if specified
    if (this.options && this.options.zIndex) {
      this.olLayer
        .getLayersArray()
        .forEach((layer) => layer.setZIndex(this.options.zIndex));
    }
    this.abortController = new AbortController();
  }

  terminate(map) {
    if (this.abortController) {
      this.abortController.abort();
    }

    super.terminate(map);

    this.dispatchEvent({
      type: 'terminate',
      target: this,
    });
  }

  setStyleConfig(url, key, apiKeyName) {
    if (!url) {
      return;
    }
    const { style } = this.options;
    const newStyleUrl = `${url}/styles/${style}/style.json${
      key ? `?${apiKeyName || 'key'}=${key}` : ''
    }`;

    if (this.filters) {
      this.loadStyle(newStyleUrl);
    }

    // Don't apply style if not necessary otherwise
    // it will remove styles apply by MapboxStyleLayer layers.
    if (this.styleUrl === newStyleUrl) {
      return;
    }

    if (!this.mbMap) {
      // The mapbox map does not exist so we only set the good styleUrl.
      // The style will be loaded in loadMbMap function.
      this.styleUrl = newStyleUrl;
      return;
    }

    // We load the new style.
    this.loadStyle(newStyleUrl);
  }

  getFeatures({ source, sourceLayer, filter } = {}) {
    const { mbMap } = this;
    // Ignore the getFeatureInfo until the source is loaded
    if (!mbMap || !mbMap.isSourceLoaded(source)) {
      return [];
    }
    return mbMap.querySourceFeatures(source, {
      sourceLayer,
      filter,
    });
  }

  /**
   * Request feature information for a given coordinate and read clustered features.
   * @param {ol/coordinate~Coordinate} coordinate Coordinate to request the information at.
   * @param {Object} options A [mapboxgl.Map#queryrenderedfeatures](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#queryrenderedfeatures) options parameter.
   * @returns {Promise<Object>} Promise with features, layer and coordinate
   *  or null if no feature was hit.
   */
  async getFeatureInfoAtCoordinate(coordinate, options) {
    // Ignore the getFeatureInfo until the mapbox map is loaded
    if (
      !options ||
      !this.format ||
      !this.mbMap ||
      !this.mbMap.isStyleLoaded()
    ) {
      return Promise.resolve({ coordinate, features: [], layer: this });
    }

    const pixel = coordinate && this.mbMap.project(toLonLat(coordinate));
    // At this point we get GeoJSON Mapbox feature, we transform it to an OpenLayers
    // feature to be consistent with other layers.
    const renderedFeatures = this.mbMap.queryRenderedFeatures(pixel, options);
    const features = [];

    for (let i = 0; i < renderedFeatures.length; i += 1) {
      const feature = renderedFeatures[i];
      if (feature.properties.cluster) {
        const source = this.mbMap.getSource(feature.layer.source);
        const { cluster_id: id, point_count: count } = feature.properties;
        // because Mapbox GL JS should be fast ...
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          source.getClusterLeaves(id, count, 0, (_, cfs) => {
            cfs.forEach((cf) => features.push(this.format.readFeature(cf)));
            resolve();
          });
        });
      } else {
        features.push(this.format.readFeature(feature));
      }
    }

    return Promise.resolve({ layer: this, features, coordinate });
  }

  loadStyle(newStyleUrl) {
    if (!newStyleUrl) {
      return;
    }
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    fetch(newStyleUrl, { signal: this.abortController.signal })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!this.mbMap) {
          return;
        }
        this.styleUrl = newStyleUrl;
        const styleFiltered = applyFilters(data, this.options.filters);
        this.mbMap.setStyle(styleFiltered);
        this.mbMap.once('styledata', () => {
          this.onStyleLoaded();
        });
      })
      .catch((err) => {
        if (err && err.name === 'AbortError') {
          // ignore user abort request
          return;
        }
        // eslint-disable-next-line no-console
        console.log('Loading of mapbox style failed: ', newStyleUrl, err);
      });
  }

  onStyleLoaded() {
    this.loaded = true;

    this.olLayer
      .getSource()
      .setAttributions(this.copyrights || getMapboxMapCopyrights(this.mbMap));

    this.dispatchEvent({
      type: 'load',
      target: this,
    });
  }
}

export default TrafimageMapboxLayer;
