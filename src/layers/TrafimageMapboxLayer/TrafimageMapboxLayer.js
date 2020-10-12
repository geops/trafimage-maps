import { MapboxLayer } from 'mobility-toolbox-js/ol';
import { toLonLat } from 'ol/proj';
import mapboxgl from 'mapbox-gl';

const getCopyrightFromSources = (mbMap) => {
  let copyrights = [];
  const regex = /<[^>]*>[^>]*<\/[^>]*>/g;
  // Trick from Mapbox AttributionControl to know if the source is used.
  const { sourceCaches } = mbMap.style;
  Object.entries(sourceCaches).forEach(([, sourceCache]) => {
    if (sourceCache.used) {
      copyrights = copyrights.concat(
        regex.exec(sourceCache.getSource().attribution),
      );
    }
  });
  return Array.from(
    new Set(copyrights.filter((copyright) => !!copyright)),
  ).join(', ');
};

const applyFilters = (mbStyle, filters) => {
  const newStyle = { ...mbStyle };
  /* Apply filters, remove style layers */
  if (mbStyle && filters) {
    const layers = [];
    (filters || []).forEach((filter) => {
      const styleLayers = mbStyle.layers;
      for (let i = 0; i < styleLayers.length; i += 1) {
        const style = styleLayers[i];
        /* filter.included boolean determines if the identified
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

  loadMbMap() {
    // If the map hasn't been resized, the center could be [NaN,NaN].
    // We set default good value for the mapbox map, to avoid the app crashes.
    let [x, y] = this.map.getView().getCenter();
    if (!x || !y) {
      x = 0;
      y = 0;
    }

    try {
      this.mbMap = new mapboxgl.Map({
        style: { version: 8, sources: {}, layers: [] },
        attributionControl: false,
        boxZoom: false,
        center: toLonLat([x, y]),
        container: this.map.getTargetElement(),
        interactive: false,
        fadeDuration:
          'fadeDuration' in this.options ? this.options.fadeDuration : 300,
        // Needs to be true to able to export the canvas, but could lead to performance issue on mobile.
        preserveDrawingBuffer: this.options.preserveDrawingBuffer || false,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed creating Mapbox map: ', err);
      return;
    }

    // Options the last render run did happen. If something changes
    // we have to render again
    this.renderState = {
      center: [x, y],
      zoom: null,
      rotation: null,
      visible: null,
      opacity: null,
      size: [0, 0],
    };

    const mapboxCanvas = this.mbMap.getCanvas();
    if (mapboxCanvas) {
      if (this.options.tabIndex) {
        mapboxCanvas.setAttribute('tabindex', this.options.tabIndex);
      } else {
        // With a tabIndex='-1' the mouse events works but the map is not focused when we click on it
        // so we remove completely the tabIndex attribute.
        mapboxCanvas.removeAttribute('tabindex');
      }
    }

    /* Load and apply the Mapbox style defined in the styleUrl property */
    this.loadStyle(this.styleUrl);
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

    this.copyright = getCopyrightFromSources(this.mbMap);

    this.dispatchEvent({
      type: 'load',
      target: this,
    });
  }
}

export default TrafimageMapboxLayer;
