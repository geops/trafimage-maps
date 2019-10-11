import qs from 'querystring';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Stroke as StrokeStyle } from 'ol/style';
import VectorLayer from 'react-spatial/layers/VectorLayer';

/**
 * Layer for visualizing routes.
 * Extends {@link https://react-spatial.geops.de/docjs.html#vectorlayer geops-spatial/layers/VectorLayer}
 * @class RouteLayer
 * @param {Object} [options] Layer options.
 * @param {string} options.apiKey Access key for [geOps services](https://developer.geops.io/).
 * @param {string} [options.name=Routen] Layer name.
 * @param {string} [options.url=https://api.geops.io/routing/v1] Url of the geOps route backend.
 * @param {boolean} [options.visible = true] Visibility of the layer.
 *   Default is true.
 * @param {string} [options.projection=EPSG:3857] Layer projection.
 *   Default is webmercator ('EPSG:3857')
 * @param {Object} [options.motColors] Mapping of colors for different mots.
 *   Default is `{ rail: '#e3000b', bus: '#ffed00', ship: '#0074be' }`.
 * @param {Function} [options.routeStyleFunction] Function called with the route properties
 *   and a boolean indicating if the zone is selected.
 *   The function should return the route color.
 */
class RouteLayer extends VectorLayer {
  constructor(options = {}) {
    super({
      name: options.name || 'Routen',
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

    // Route url
    this.url = options.url || 'https://api.geops.io/routing/v1';

    // Function for route styling
    this.routeStyleFunction = options.routeStyleFunction || (() => {});

    this.selectedRouteIds = [];

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
   * Getting the Mot-features on specific route.
   * @private
   * @param {Object} viaPoints Route Informations
   * @param {String} mot Ask for specific Route
   * @param {Object[]} sequenceProps Properties for the returned features.
   * @returns {array<ol.Feature>}
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

  routeStyle(feature) {
    const { routeId } = feature.get('route');
    const mot = feature.get('mot');
    const isSelected = this.selectedRouteIds.includes(routeId);
    const color =
      this.routeStyleFunction(feature.getProperties(), isSelected) ||
      this.motColors[mot];

    return new Style({
      stroke: new StrokeStyle({
        width: 5,
        color: color || 'green',
      }),
    });
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
