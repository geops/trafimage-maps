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

const getMapboxStyle = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
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
  }

  terminate(map) {
    super.terminate(map);

    this.dispatchEvent({
      type: 'terminate',
      target: this,
    });
  }

  setStyleConfig(url, key) {
    if (!url) {
      return;
    }
    const { style, url: url2 } = this.options;
    const newStyleUrl =
      url2 || `${url}/styles/${style}/style.json${key ? `?key=${key}` : ''}`;

    // Don't apply style if not necessary otherwise
    // it will remove styles apply by MapboxStyleLayer layers.
    if (this.styleUrl === newStyleUrl) {
      return;
    }
    if (!this.mbMap) {
      // The mapbox map does not exist so we only set the good styleUrl.
      this.styleUrl = newStyleUrl;
      return;
    }

    fetch(newStyleUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Ensure we don't reload the style for nothing.
        if (this.styleUrl === newStyleUrl) {
          return;
        }
        this.styleUrl = newStyleUrl;
        if (!this.mbMap) {
          return;
        }
        this.mbMap.setStyle(data);
        this.mbMap.once('styledata', () => {
          this.dispatchEvent({
            type: 'change:styleurl',
            target: this,
          });
        });
      });
  }

  /**
   * Create the mapbox map.
   */
  async loadMbMap() {
    // If the map hasn't been resized, the center could be [NaN,NaN].
    // We set default good value for the mapbox map, to avoid the app crashes.
    let [x, y] = this.map.getView().getCenter();
    if (!x || !y) {
      x = 0;
      y = 0;
    }

    /* Get the MapBox style */
    const mapboxStyle = await getMapboxStyle(this.styleUrl);

    /* Apply filters, remove style layers */
    if (this.options.filters) {
      const layers = [];
      this.options.filters.forEach((filter) => {
        const styleLayers = mapboxStyle.layers;
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
            layers.push(mapboxStyle.layers[i]);
          }
        }
      });
      mapboxStyle.layers = layers;
    }

    try {
      /**
       * A mapbox map
       * @type {mapboxgl.Map}
       */
      this.mbMap = new mapboxgl.Map({
        style: mapboxStyle,
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
      console.warn('Failed creating mapbox map: ', err);
    }

    // Options the last render run did happen. If something changes
    // we have to render again
    /** @ignore */
    this.renderState = {
      center: [x, y],
      zoom: null,
      rotation: null,
      visible: null,
      opacity: null,
      size: [0, 0],
    };

    this.mbMap.once('load', () => {
      /**
       * Is the map loaded.
       * @type {boolean}
       */
      this.loaded = true;
      if (!this.copyright) {
        /**
         * Copyright statement.
         * @type {string}
         */
        this.copyright = getCopyrightFromSources(this.mbMap);
      }
      this.dispatchEvent({
        type: 'load',
        target: this,
      });
      this.olLayer.changed();
    });

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
}

export default TrafimageMapboxLayer;
