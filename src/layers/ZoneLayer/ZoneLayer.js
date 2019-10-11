import qs from 'querystring';
import OLVectorLayer from 'ol/layer/Vector';
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
import VectorLayer from 'react-spatial/layers/VectorLayer';
import intersect from '@turf/intersect';
import Color from 'color';

/**
 * Layer for visualizing fare networks.
 *
 * <img src="img/layers/ZoneLayer/layer.png" alt="Layer preview" title="Layer preview">
 *
 * Extends {@link https://react-spatial.geops.de/docjs.html#vectorlayer geops-spatial/layers/VectorLayer}
 * @class ZoneLayer
 * @param {Object} options Layer options.
 * @param {String} apiKey Access key for [geOps services](https://developer.geops.io/).
 * @param {boolean} options.visible Visibility of the layer.
 * @param {number} [options.labelOptimizationMinResolution = 100] Minimum resolution for
 *   using optimized label placement based on the current extent.
 * @param {string} options.url Url of the geOps fare network backend.
 * @param {Object} [options.zoneStyle] Zone style.
 * @param {Object} [options.zoneStyle.fill] Fill properties.
 * @param {string} [options.zoneStyle.fill.color = 'rgb(255, 200, 25)'] Fill color.
 * @param {Object} [options.zoneStyle.stroke] Stroke properties.
 * @param {number} [options.zoneStyle.stroke.width = 2] Stroke width.
 * @param {string} [options.zoneStyle.stroke.color = 'black'] Stroke color.
 * @param {Object} [options.zoneStyle.text] Text properties.
 * @param {string} [options.zoneStyle.text.font = '12px Arial'] Font.
 * @param {string} [options.zoneStyle.text.label] Text label.
 *   If undefined, the zone code is used.
 * @param {string} [options.zoneStyle.text.color = 'black'] Text color.
 * @param {Function} [options.zoneStyleFunction] called with zone properties as
 *   an Object and a boolean indicating if the zone is selected.
 *   The function should return a zoneStyle object (see above).
 */
class ZoneLayer extends VectorLayer {
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
      olLayer: new OLVectorLayer({
        source: new VectorSource(),
        style: (f, r) => this.internalZoneStyleFunction(f, r),
      }),
      ...options,
    });

    this.defaultZoneStyle = {
      fill: {
        color: 'rgb(255, 200, 25)',
      },
      stroke: {
        width: 2,
        color: 'black',
      },
      text: {
        font: '12px Arial',
        color: 'black',
      },
      ...(options.zoneStyle || {}),
    };

    this.apiKey = options.apiKey;

    this.url = options.url || 'https://api.geops.io/casa-fare-network/v1';

    this.labelOptimizeMinRes = options.labelOptimizationMinResolution || 100;

    this.fetchZones();

    this.zoneStyleFunction = options.zoneStyleFunction || (() => ({}));

    this.selectedZones = [];

    this.onClick(features => {
      if (features.length) {
        const [feature] = features;

        if (feature.get('isClickable')) {
          const idx = this.selectedZones.indexOf(feature);
          if (idx > -1) {
            this.selectedZones.splice(idx, 1);
          } else {
            this.selectedZones.push(feature);
          }

          this.olLayer.changed();
        }
      }
    });
  }

  /**
   * Clears the layer.
   */
  clear() {
    if (this.abortController && !this.abortController.signal.aborted) {
      this.abortController.abort();
    }

    this.olLayer.getSource().clear();
  }

  /**
   * Get zone based on params
   * @private
   * @param {Object} params
   */
  fetchZones(params = {}) {
    this.clear();

    this.abortController = new AbortController();

    const format = new GeoJSON();
    const urlParams = {
      ...params,
      key: this.apiKey,
      simplify: 100,
      srs: 3857,
    };

    const url = `${this.url}/zonen?${qs.stringify(urlParams)}`;

    return fetch(url, { signal: this.abortController.signal })
      .then(res => res.json())
      .then(data => {
        const features = format.readFeatures(data);
        this.olLayer.getSource().clear();
        this.olLayer.getSource().addFeatures(features);
        return features;
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.info('Request cancelled');
      });
  }

  /**
   * Zoom to visible zones.
   * @param {Object} [options] fitOptions
   *   see {@link https://openlayers.org/en/latest/apidoc/module-ol_View-View.html ol/View~View}
   */
  zoomToZones(options) {
    const fitOptions = { padding: [20, 20, 20, 20], ...options };
    this.map.getView().fit(this.olLayer.getSource().getExtent(), fitOptions);
  }

  /**
   * Load zones from a given configuration.
   * @param {Object[]} config Array of objects defining selected zones.
   * @param {number} config[].partnerCode Partner code.
   * @param {Object[]} config[].zones Array of zones to select.
   * @param {number} [config[].zones[].zoneCode] Code of zone to select.
   * @param {string} [config[].zones[].zoneName] Name of zone to select.
   * @param {boolean} [config[].zones[].isSelected] If true, the zone
   *   is initially selected.
   * @param {boolean} [config[].zones[].isClickable] If true, the zone
   *   can be selected by click.
   * @returns {Promise<Feature[]>} Promise resolving OpenLayers features.
   */
  loadZones(config) {
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

    return this.fetchZones({ filter: qryParams.join(',') }).then(features => {
      // Preselect features
      for (let i = 0; i < features.length; i += 1) {
        const zoneCode = features[i].get('zone');
        const partnerCode = features[i].get('partner_code');
        const partner = config.find(c => c.partnerCode === partnerCode);

        if (partner) {
          const zone = partner.zones.find(
            z => `${z.zoneCode}` === `${zoneCode}`,
          );

          if (zone) {
            features[i].set('isClickable', zone.isClickable);

            if (zone.isSelected) {
              this.selectedZones.push(features[i]);
            }
          }
        }
      }
    });
  }

  /**
   * Internal function for extracting a feature's style at a given resolution
   * @private
   * @param {ol.feature} feature {@link https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html ol/Feature}
   * @param {number} resolution
   * @returns {ol.style[]}
   */
  internalZoneStyleFunction(feature, resolution) {
    const isSelected = this.selectedZones.indexOf(feature) > -1;
    const styleObject = {
      ...this.defaultZoneStyle,
      ...this.zoneStyleFunction(feature.getProperties(), isSelected),
    };

    const zone = parseInt(feature.get('zone'), 10);

    let opacity = 0.5;
    opacity = resolution < 100 ? 0.3 : opacity;
    opacity = resolution < 50 ? 0.1 : opacity;

    let textGeometry;
    const color = new Color(styleObject.fill.color).rgb().array();

    if (resolution <= this.labelOptimizeMinRes) {
      // optimize text positioning
      const mapExtent = this.map.getView().calculateExtent();
      const geomExtent = feature.getGeometry().getExtent();

      if (!containsExtent(mapExtent, geomExtent)) {
        textGeometry = ZoneLayer.getOptimizedLanelGeometry(feature, mapExtent);
      }
    }

    return [
      new Style({
        stroke: new StrokeStyle({
          color,
          width: styleObject.stroke.width,
        }),
        fill: new FillStyle({
          color: [...color, opacity],
        }),
      }),
      new Style({
        geometry: textGeometry,
        text: new TextStyle({
          font: styleObject.text.font,
          fill: new FillStyle({
            color: styleObject.text.color,
          }),
          stroke: new StrokeStyle({
            color: 'white',
            width: 2,
          }),
          text: styleObject.text.label || `${zone}`,
        }),
      }),
    ];
  }
}

export default ZoneLayer;
