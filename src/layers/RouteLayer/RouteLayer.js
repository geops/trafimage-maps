import qs from 'query-string';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Stroke as StrokeStyle } from 'ol/style';
import VectorLayer from 'react-spatial/layers/VectorLayer';

/**
 * @typedef {Object} routeStyle
 * @property {Object} stroke Stroke style.
 * @property {number} [stroke.width=5] Stroke width in pixel. Default is 5.
 * @property {string} [stroke.color] Stroke color.
 *   Default is '#e3000b' for rail, '#ffed00' for bus and '#0074be' for ship.
 * @property {Object} [outline] Outline style.
 * @property {number} [outline.width] Outline width in pixel. By default there's no outline.
 * @property {string} [outline.color] Outline color.
 * Example for a route style: {
 *   stroke: { width: 5, color: 'red' },
 *   outline: { width: 7, color: 'white' },
 * }
 */

/**
 * @callback routeStyleFunction
 * @param {Object} properties Route properties.
 * @param {boolean} isSelected Whether the route is selected.
 * @returns {RouteStyle} The route style.
 */

/**
 * Layer for visualizing routes.
 *
 * <img src="img/layers/RouteLayer/layer.png" alt="Layer preview" title="Layer preview">
 *
 * Extends {@link https://react-spatial.geops.de/docjs.html#vectorlayer react-spatial/layers/VectorLayer}
 * @class RouteLayer
 * @param {Object} [options] Layer options.
 * @param {string} options.apiKey Access key for [geOps services](https://developer.geops.io/).
 * @param {Object} [options.motColors] Mapping of colors for different mots.
 *   Default is `{ rail: '#e3000b', bus: '#ffed00', ship: '#0074be' }`.
 * @param {routeStyleFunction} [options.routeStyleFunction] Style function.
 */
class RouteLayer extends VectorLayer {
  constructor(options = {}) {
    super({
      name: 'RouteLayer',
      olLayer: new OLVectorLayer({
        style: f => this.routeStyle(f),
        source: new VectorSource(),
      }),
      ...options,
    });

    this.projection = options.projection || 'EPSG:3857';

    // API key
    this.apiKey = options.apiKey;

    // Colors for differtent modes of transportation
    this.motColors = options.motColors || {
      rail: '#e3000b',
      bus: '#ffed00',
      ship: '#0074be',
    };

    this.url = 'https://api.geops.io/routing/v1';
    this.selectedRouteIds = [];
    this.routeStyleFunction =
      options.routeStyleFunction || this.defaultRouteStyleFunction;

    this.onClick(features => {
      if (features.length) {
        const [feature] = features;
        const { isClickable, routeId } = feature.get('route');

        if (isClickable) {
          const idx = this.selectedRouteIds.indexOf(routeId);
          if (idx > -1) {
            this.selectedRouteIds.splice(idx, 1);
          } else {
            this.selectedRouteIds.push(routeId);
          }

          this.olLayer.changed();
        }
      }
    });
  }

  /**
   * Converts an route style to an ol style.
   * @private
   * @param {ol.Feature} feature The ol.Feature to style.
   * @param {RouteStyle} routeStyle Style of the route.
   * @param {boolean} [isSelected=false] Whether the feature is selected.
   */
  getOlStyleFromRouteStyle(feature, routeStyle = {}, isSelected = false) {
    const strokeStyle = {
      ...{ color: this.motColors[feature.get('mot')], width: 5 },
      ...routeStyle.stroke,
    };

    const style = [
      new Style({
        stroke: new StrokeStyle({
          ...strokeStyle,
        }),
      }),
    ];

    if (routeStyle.outline) {
      style.unshift(
        new Style({
          stroke: new StrokeStyle({
            ...routeStyle.outline,
          }),
        }),
      );
    }

    if (isSelected) {
      style.forEach(s => s.setZIndex(1));
    }

    return style;
  }

  /**
   * Default route style function.
   * @private
   * @param {Object} properties Feature properties.
   * @param {boolean} isSelected Whether the feature is selected.
   * @returns {RouteStyle}
   */
  defaultRouteStyleFunction(properties, isSelected = false) {
    return {
      stroke: {
        color: isSelected ? 'blue' : this.motColors[properties.mot],
        width: 5,
      },
      outline: {
        color: 'white',
        width: 10,
      },
    };
  }

  /**
   * Getting the Mot-features on specific route.
   * @private
   * @param {Object} viaPoints Route Informations
   * @param {String} mot Ask for specific Route
   * @param {Object[]} sequenceProps Properties for the returned features.
   * @returns {array<ol.Feature>} Features
   */
  fetchRouteForMot(viaPoints, mot, sequenceProps) {
    this.abortController = new AbortController();

    const via = viaPoints.map(v => `!${v}`);
    const urlParams = {
      key: this.apiKey || '',
      via: via.join('|'),
      mot,
    };

    const url = `${this.url}?${qs.stringify(urlParams)}`;
    const format = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: this.projection,
    });

    return fetch(url, { signal: this.abortController.signal })
      .then(res => res.json())
      .then(data => {
        const features = format.readFeatures(data);
        features.forEach(f => f.setProperties(sequenceProps));
        return features;
      });
  }

  /**
   * Returns the style of the given feature.
   * @private
   * @param {ol.feature} feature {@link https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html ol/Feature}
   * @returns {ol.style} get the feature's style function.
   */
  routeStyle(feature) {
    const { routeId } = feature.get('route');
    const isSelected = this.selectedRouteIds.includes(routeId);
    const routeStyle = this.routeStyleFunction(
      feature.getProperties(),
      isSelected,
    );
    return this.getOlStyleFromRouteStyle(feature, routeStyle, isSelected);
  }

  /**
   * Load routes based on a given configuration.
   * @param {Object[]} routes Routes.
   * @param {boolean} routes[].isSelected If true, the route is
   *   selected initially.
   * @param {boolean} routes[].isClickable If true, the route can be
   *   selected or unselected by click.
   * @param {Object[]} routes[].sequences Route sequences.
   * @param {number} routes[].sequences[].uicFrom UIC number of start station.
   * @param {number} routes[].sequences[].uicTo UIC number of end station.
   * @param {string} routes[].sequences[].mot Method of transportation.
   *   Allowed values are "rail", "bus", "tram", "subway", "gondola",
   *   "funicular" and "ferry"
   * @returns {Promise<Feature[]>} Promise resolving OpenLayers features.
   */
  loadRoutes(routes) {
    const routePromises = [];

    for (let i = 0; i < routes.length; i += 1) {
      let via = [];

      if (!routes[i].sequences) {
        throw new Error('Missing route sequences.');
      }

      for (let j = 0; j < routes[i].sequences.length; j += 1) {
        const { mot, uicFrom, uicTo } = routes[i].sequences[j];
        const nextMot =
          j === routes[i].sequences.length - 1
            ? null
            : routes[i].sequences[j + 1].mot;

        via = via.concat([uicFrom, uicTo]);

        if (mot !== nextMot) {
          const sequenceProps = { route: { ...routes[i], routeId: i }, mot };
          routePromises.push(this.fetchRouteForMot(via, mot, sequenceProps));
          via = [];
        }
      }
    }

    return Promise.all(routePromises).then(data => {
      const sequenceFeatures = data.flat().filter(f => f);
      this.olLayer.getSource().addFeatures(sequenceFeatures);
      sequenceFeatures.forEach(f => {
        const { routeId, isSelected } = f.get('route');
        if (isSelected) {
          this.selectedRouteIds.push(routeId);
        }
      });
      return sequenceFeatures;
    });
  }

  /**
   * Zoom to route.
   * @param {Object} [fitOptions] Options,
   *   see {@link https://openlayers.org/en/latest/apidoc/module-ol_View-View.html ol/View~View}
   */
  zoomToRoute(options) {
    const fitOptions = { padding: [20, 20, 20, 20], ...options };
    this.map.getView().fit(this.olLayer.getSource().getExtent(), fitOptions);
  }

  /**
   * Clears the layer.
   */
  clear() {
    if (this.abortController && !this.abortController.signal.aborted) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.selectedRouteIds = [];
    this.olLayer.getSource().clear();
  }
}

export default RouteLayer;
