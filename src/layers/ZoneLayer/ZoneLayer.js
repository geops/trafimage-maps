import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {
  Style,
  Fill as FillStyle,
  Stroke as StrokeStyle,
  Text as TextStyle,
} from 'ol/style';
import { containsExtent } from 'ol/extent';
import MultiPolygon from 'ol/geom/MultiPolygon';
import { fromExtent } from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import { intersect } from 'turf';
import Layer from 'react-spatial/Layer';

/**
 * Layer for visualizing fare networks.
 * @class ZoneLayer
 * @param {Object} options Layer options.
 * @param {boolean} options.visible Visibility of the layer.
 * @param (number} options.labelOptimizationMinResolution Minimum resolution for
 *   using optimized label placement based on the current extent. Default is 100.
 * @param {string} options.url Url of the geOps fare network backend.
 */
class ZoneLayer extends Layer {
  static getOptimizedLanelGeometry(feature, mapExtent) {
    const mapPolygon = fromExtent(mapExtent);
    const format = new GeoJSON();
    const intersection = intersect(
      format.writeFeatureObject(new Feature(mapPolygon)),
      format.writeFeatureObject(feature),
    );

    if (intersection) {
      const intersectionFeature = format.readFeature(intersection);
      const geom = intersectionFeature.getGeometry();
      if (geom instanceof MultiPolygon) {
        return geom.getInteriorPoints();
      }

      return geom.getInteriorPoint();
    }

    return undefined;
  }

  constructor(options = {}) {
    super({
      name: 'Verbundzonen',
      olLayer: new VectorLayer({
        source: new VectorSource(),
        style: (f, r) => this.zoneStyle(f, r),
      }),
      ...options,
    });

    this.url = options.url || 'https://geops.cloud.tyk.io/casa-fare-network';
    this.labelOptimizeMinRes = options.labelOptimizationMinResolution || 100;
    this.token = options.token;

    this.fetchZones();
  }

  fetchZones(params = {}) {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    this.olLayer.getSource().clear();

    const format = new GeoJSON();
    const urlParams = { ...params, ...{ token: this.token, simplify: 100 } };
    let url = `${this.url}/zonen`;

    Object.keys(urlParams).forEach(key => {
      url += url.indexOf('?') > -1 ? '&' : '?';
      url += `${key}=${urlParams[key]}`;
    });

    return fetch(url, { signal: this.abortController.signal })
      .then(res => res.json())
      .then(data => {
        const features = format.readFeatures(data, {
          dataProjection: 'EPSG:21781',
          featureProjection: 'EPSG:3857',
        });
        this.olLayer.getSource().clear();
        this.olLayer.getSource().addFeatures(features);
        return features;
      });
  }

  /**
   * Zoom to visible zones.
   * @param {Object} [fitOptions] Options,
   *   see https://openlayers.org/en/latest/apidoc/module-ol_View-View.html
   */
  zoomToZones(options) {
    const fitOptions = { padding: [20, 20, 20, 20], ...options };
    this.map.getView().fit(this.olLayer.getSource().getExtent(), fitOptions);
  }

  /**
   * Select zones by a given configuration.
   * @param {Object[]} config Array of objects defining selected zones.
   * @param {number} config[].partnerCode Partner code.
   * @param {Object[]} config[].zones Array of zones to select.
   * @param {number} [config[].zones[].zoneCode] Code of zone to select.
   * @param {string} [config[].zones[].zoneName] Name of zone to select.
   * @returns {Promise<Feature[]>} Promise resolving OpenLayers features.
   */
  selectZonesByConfig(config) {
    const qryParams = [];

    // Buid query parameter as expected by the api.
    // Example: ?filter=zones=801:10:Davos,490:120:,490:170:
    for (let i = 0; i < config.length; i += 1) {
      for (let j = 0; j < config[i].zones.length; j += 1) {
        qryParams.push(
          [
            config[i].partnerCode || '',
            config[i].zones[j].zoneCode || '',
            config[i].zones[j].zoneName || '',
          ].join(':'),
        );
      }
    }

    return this.fetchZones({ filter: qryParams.join(',') });
  }

  zoneStyle(feature, resolution) {
    const zone = parseInt(feature.get('zone'), 10);

    let opacity = 0.5;
    opacity = resolution < 100 ? 0.3 : opacity;
    opacity = resolution < 50 ? 0.1 : opacity;

    let textGeometry;
    const color = [255, 200, 25];

    if (resolution <= this.labelOptimizeMinRes) {
      // optimize text positioning
      const mapExtent = this.map.getView().calculateExtent();
      const geomExtent = feature.getGeometry().getExtent();

      if (!containsExtent(mapExtent, geomExtent)) {
        textGeometry = ZoneLayer.getOptimizedLanelGeometry(
          feature,
          mapExtent,
        );
      }
    }

    return [
      new Style({
        stroke: new StrokeStyle({
          color,
          width: 2,
        }),
        fill: new FillStyle({
          color: [...color, opacity],
        }),
      }),
      new Style({
        geometry: textGeometry,
        text: new TextStyle({
          font: '12px Arial',
          fill: new FillStyle({
            color: 'black',
          }),
          stroke: new StrokeStyle({
            color: 'white',
            width: 2,
          }),
          text: `${zone}`,
        }),
      }),
    ];
  }

  init(map) {
    super.init(map);
    this.map = map;
  }
}

export default ZoneLayer;
