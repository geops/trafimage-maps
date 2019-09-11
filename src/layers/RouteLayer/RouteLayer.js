import qs from 'querystring';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Stroke as StrokeStyle } from 'ol/style';
import VectorLayer from 'react-spatial/layers/VectorLayer';

/**
 * Layer for visualizing fare networks.
 * Extends {@link https://react-spatial.geops.de/docjs.html#vectorlayer geops-spatial/layers/VectorLayer}
 * @class RouteLayer
 * @param {Object} [options] Layer options.
 * @param {string?} [options.apiKey] Access key for geOps services.
 * @param {string} [options.name] Layer name.
 * @param {string} [options.url] Url of the geOps route backend.
 * @param {boolean} [options.visible = true] Visibility of the layer.
 *   Default is true.
 * @param {string} [options.projection] Layer projection.
 *   Default is webmercator ('EPSG:3857')
 * @param {Object} [options.motColors] Mapping of colors for different mots.
 *   Default is `{ rail: '#e3000b', bus: '#ffed00', ship: '#0074be' }`.
 * @param [options.routeStyleFunction] Function called with the route properties
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
      const [feature] = features;

      if (feature) {
        const routeId = feature.get('routeId');
        const idx = this.selectedRouteIds.indexOf(routeId);
        if (idx > -1) {
          this.selectedRouteIds.splice(idx, 1);
        } else {
          this.selectedRouteIds.push(routeId);
        }

        this.olLayer.changed();
      }
    });
  }

  /**
   * Gettint the Mot-features on specific route.
   * @private
   * @param {Object} viaPoints Route Informations
   * @param {String} mot ask for specific Route
   * @returns {array<ol.feature>}
   */
  fetchRouteForMot(viaPoints, mot) {
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
        features.forEach(f => f.set('mot', mot));
        return features;
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.info('Request cancelled');
      });
  }

  routeStyle(feature) {
    const mot = feature.get('mot');
    const isSelected = this.selectedRouteIds.includes(feature.get('routeId'));
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
   * @param {Object[]} sequences Route sequences.
   * @param {number} sequences[].uicFrom UIC number of start station.
   * @param {number} sequences[].uicTo UIC number of end station.
   * @param {string} sequences[].mot Method of transportation.
   *   Allowed values are "rail", "bus", "tram", "subway", "gondola",
   *   "funicular" and "ferry"
   * @returns {Promise<Feature[]>} Promise resolving OpenLayers features.
   */
  loadRoutes(sequences) {
    let via = [];
    let mot;
    const routePromises = [];

    for (let i = 0; i < sequences.length; i += 1) {
      mot = mot || sequences[i].mot;

      if (mot !== sequences[i].mot) {
        routePromises.push(this.fetchRouteForMot(via, mot));
        ({ mot } = sequences[i]);
        via = [sequences[i].uicFrom, sequences[i].uicTo];
      } else {
        via = via.concat([sequences[i].uicFrom, sequences[i].uicTo]);
      }
    }

    routePromises.push(this.fetchRouteForMot(via, mot));

    return Promise.all(routePromises).then(data => {
      this.olLayer.getSource().clear();
      for (let i = 0; i < data.length; i += 1) {
        data[i].forEach(feat => feat.set('routeId', i));
        this.olLayer.getSource().addFeatures(data[i]);
      }
    });
  }

  /**
   * Zoom to route.
   * @param {Object} [fitOptions] Options,
   *   see https://openlayers.org/en/latest/apidoc/module-ol_View-View.html
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

    this.olLayer.getSource().clear();
  }
}

export default RouteLayer;
