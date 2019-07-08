import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Stroke as StrokeStyle } from 'ol/style';
import Layer from 'react-spatial/Layer';

/**
 * Layer for visualizing fare networks.
 * @class RouteLayer
 * @param {Object} [options] Layer options.
 * @param {string} options.token Access token for geOps services.
 * @param {string} [options.name] Layer name.
 * @param {string} [options.url] Url of the geOps route backend.
 * @param {boolean} [options.visible] Visibility of the layer.
 *   Default is true.
 * @param {string} [projection] Layer projection.
 *   Default is webmercator ('EPSG:3857')
 */
class RouteLayer extends Layer {
  constructor(options = {}) {
    super({
      name: options.name || 'Routen',
      olLayer: new VectorLayer({
        style: f => this.routeStyle(f),
        source: new VectorSource(),
      }),
      ...options,
    });

    this.projection = options.projection || 'EPSG:3857';

    // Cache for storing route styles
    this.routeStyleCache = {};

    // API token
    this.token = options.token;

    // Colors for differtent modes of transportation
    this.motColors = {
      train: '#e3000b',
      rail: '#e3000b',
      bus: '#ffed00',
      ship: '#0074be',
    };

    // Route url
    this.url =
      (options || {}).url ||
      `https://geops.cloud.tyk.io/routing?token=${this.token}`;
  }

  fetchRouteForMot(viaPoints, mot) {
    const via = viaPoints.map(v => `!${v}`);
    const url = `${this.url}&via=${via.join(';')}&mot=${mot}`;
    const format = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: this.projection,
    });

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const features = format.readFeatures(data);
        features.forEach(f => f.set('mot', mot));
        this.olLayer.getSource().clear();
        this.olLayer.getSource().addFeatures(features);
      });
  }

  routeStyle(feature) {
    const mot = feature.get('mot');

    if (!this.routeStyleCache[mot]) {
      this.routeStyleCache[mot] = new Style({
        stroke: new StrokeStyle({
          width: 5,
          color: this.motColors[mot] || 'green',
        }),
      });
    }

    return this.routeStyleCache[mot];
  }

  /**
   * Generate the route for a given configuration.
   * @param {Object[]} sequences Route sequences.
   * @param {number} sequences[].uicFrom UIC number of start station.
   * @param {number} sequences[].uicTo UIC number of end station.
   * @param {string} sequences[].mot Method of transportation.
   *   Allowed values are "rail", "bus", "tram", "subway", "gondola",
   *   "funicular" and "ferry"
   * @returns {Promise<Feature>} an OpenLayers feature.
   *   See https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html.
   */
  getRoute(sequences) {
    let via = [];
    let mot;

    for (let i = 0; i < sequences.length; i += 1) {
      mot = mot || sequences[i].mot;

      if (mot !== sequences[i].mot) {
        this.fetchRouteForMot(via, mot);
        ({ mot } = sequences[i]);
        via = [sequences[i].uicFrom, sequences[i].uicTo];
      } else {
        via = via.concat([sequences[i].uicFrom, sequences[i].uicTo]);
      }
    }

    this.fetchRouteForMot(via, mot);
  }

  init(map) {
    super.init(map);
    this.map = map;
  }
}

export default RouteLayer;
