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
    this.style = options.style;
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

  setStyle(newStyle) {
    // TODO manage if newStyle is null
    if (this.style === newStyle || !newStyle) {
      return;
    }
    this.style = newStyle;
    this.setStyleConfig();
  }

  applyStyle(data) {
    const styleFiltered = applyFilters(data, this.filters);

    this.mbMap.setStyle(styleFiltered);
    this.mbMap.once('styledata', () => {
      this.onStyleLoaded();
    });
  }

  setStyleConfig(url, key, apiKeyName) {
    if (url && url !== this.url) {
      this.url = url;
    }
    if (key && key !== this.apiKey) {
      this.apiKey = key;
    }
    if (apiKeyName && apiKeyName !== this.apiKeyName) {
      this.apiKeyName = apiKeyName;
    }
    if ((!url && !key && !apiKeyName) || !this.styleUrl) {
      this.styleUrl = `${this.url}/styles/${this.style}/style.json?`;
    }

    const newStyleUrl = this.createStyleUrl();

    // Don't apply style if not necessary otherwise
    // it will remove styles applied by MapboxStyleLayer layers.
    if (this.styleUrl === newStyleUrl) {
      return;
    }

    if (!this.mbMap) {
      // The mapbox map does not exist so we only set the good styleUrl.
      // The style will be loaded in loadMbMap function.
      this.styleUrl = newStyleUrl;
      if (this.filters) {
        this.on('load', () => {
          this.applyStyle(this.mbMap.getStyle());
        });
      }
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
      !this.mbMap.isStyleLoaded() ||
      this.map?.getView().getAnimating() ||
      this.map?.getView().getInteracting()
    ) {
      return Promise.resolve({ coordinate, features: [], layer: this });
    }

    const pixel = coordinate && this.mbMap.project(toLonLat(coordinate));

    // At this point we get GeoJSON Mapbox feature, we transform it to an OpenLayers
    // feature to be consistent with other layers.
    const renderedFeatures = this.mbMap.queryRenderedFeatures(pixel, options);
    const features = [];
    const promises = [];

    for (let i = 0; i < renderedFeatures.length; i += 1) {
      const feature = renderedFeatures[i];
      if (feature.properties.cluster) {
        const source = this.mbMap.getSource(feature.layer.source);
        const { cluster_id: id, point_count: count } = feature.properties;
        // because Mapbox GL JS should be fast ...
        // eslint-disable-next-line no-await-in-loop
        promises.push(
          new Promise((resolve) => {
            source.getClusterLeaves(id, count, 0, (_, cfs) => {
              cfs.forEach((cf) => {
                const olFeature = this.format.readFeature(cf);
                if (olFeature) {
                  olFeature.set('mapboxFeature', cf);
                }
                features.push(olFeature);
              });
              resolve(cfs);
            });
          }),
        );
      } else {
        const olFeature = this.format.readFeature(feature);
        if (olFeature) {
          olFeature.set('mapboxFeature', feature);
        }
        features.push(olFeature);
      }
    }

    if (promises.length) {
      return Promise.all(promises).then(() => {
        return { layer: this, features, coordinate };
      });
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
        this.applyStyle(data);
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

  /**
   * Create a copy of the TrafimageMapboxLayer.
   * @param {Object} newOptions Options to override
   * @returns {TrafimageMapboxLayer} A TrafimageMapboxLayer
   */
  clone(newOptions) {
    return new TrafimageMapboxLayer({ ...this.options, ...newOptions });
  }
}

export default TrafimageMapboxLayer;
