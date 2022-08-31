import 'react-app-polyfill/stable';
import qs from 'query-string';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Group as LayerGroup } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import { containsExtent } from 'ol/extent';
import MultiPolygon from 'ol/geom/MultiPolygon';
import { fromExtent } from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import intersect from '@turf/intersect';
import CasaLayer from '../CasaLayer';

/**
 * Layer for visualizing fare networks.
 *
 * <img src="img/layers/ZoneLayer/layer.png" alt="Layer preview" title="Layer preview">
 * @class ZoneLayer
 * @extends CasaLayer
 * @param {Object} options Layer options.
 * @param {string} [options.url = https://api.geops.io/casa-fare-network/v1] Url to fetch zones.
 * @param {string} [options.validFrom] Zone validity start. Format: yyyy-mm-dd.
 * @param {string} [options.validTo] Zone validity end . Format: yyyy-mm-dd.
 * @param {number} [options.simplify = 100] Simplification measurement for
 *  Douglas Peucker algorithm.
 * @param {number} [options.labelOptimizationMinResolution = 100] Minimum resolution for
 *   using optimized label placement based on the current extent.
 */
class ZoneLayer extends CasaLayer {
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
    const properties = { isQueryable: true, ...(options.properties || {}) };
    super({
      name: 'Verbundzonen',
      olLayer: new LayerGroup({
        layers: [
          new OLVectorLayer({
            source: new VectorSource(),
            style: (f, r) => this.zoneStyle(f, r)[0],
          }),
          new OLVectorLayer({
            source: new VectorSource(),
            style: (f, r) => this.zoneStyle(f, r)[1],
            zIndex: 1,
          }),
        ],
      }),
      ...options,
      properties,
    });

    this.layers = this.olLayer.getLayers().getArray();

    [this.featuresLayer, this.labelsLayer] = this.layers;

    this.validFrom = options.validFrom;

    this.validTo = options.validTo;

    this.simplify =
      typeof options.simplify === 'undefined' ? 100 : options.simplify;

    this.url = options.url || 'https://api.geops.io/casa-fare-network/v1';

    this.labelOptimizeMinRes = options.labelOptimizationMinResolution || 100;

    this.selectedZones = [];

    this.onClick((features) => {
      if (features.length) {
        const [feature] = features;

        if (feature.get('isClickable')) {
          const idx = this.selectedZones.indexOf(feature);
          if (idx > -1) {
            this.selectedZones.splice(idx, 1);
          } else {
            this.selectedZones.push(feature);
          }
          this.featuresLayer.changed();
          this.labelsLayer.changed();
        }
      }
    });
  }

  /**
   * Default style function of the layer.
   * The returned style can be overriden by using a style function.
   */
  // eslint-disable-next-line class-methods-use-this
  defaultStyleFunction(feature, isSelected, isHovered) {
    if (isSelected && !isHovered) {
      return {
        fill: {
          color: [104, 104, 104, 0.7],
        },
        stroke: {
          color: '#fff',
        },
        text: {
          color: '#fff',
        },
      };
    }

    if (isHovered) {
      return {
        fill: {
          color: [102, 102, 102, 0.3],
        },
        stroke: {
          width: 2,
          color: '#4576a2',
        },
        text: {
          color: '#4576a2',
        },
      };
    }

    return {
      fill: {
        color: [102, 102, 102, 0.2],
      },
      stroke: {
        color: [102, 102, 102, 0.2],
        width: 1,
      },
      text: {
        color: '#4576A2',
      },
    };
  }

  /**
   * Set the validity of the zone.
   * @param {string} validFrom Zone validity start. Format: yyyy-mm-dd.
   * @param {string} validTo Zone validity end. Format: yyyy-mm-dd.
   */
  setValidity(validFrom, validTo) {
    this.validFrom = validFrom;
    this.validTo = validTo;
  }

  /**
   * Converts a zone style to an ol.Style.
   * @private
   * @param {styleObject} styleObject Style of the zone.
   * @param {boolean} [isSelected = false] Whether the feature is selected.
   * @param {ol.Feature} feature The ol.Feature to style.
   * @param {number} resolution Map resolution.
   */
  getOlStylesFromObject(
    styleObject = {},
    isSelected = false,
    isHovered = false,
    feature,
    res,
  ) {
    const olStyles = super.getOlStylesFromObject(
      styleObject,
      isSelected,
      isHovered,
      feature,
    );
    if (olStyles.text) {
      olStyles.text.getText().setText(feature.get('zone'));

      // change text geometry
      if (res <= this.labelOptimizeMinRes) {
        const mapExtent = this.map.getView().calculateExtent();
        const geomExtent = feature.getGeometry().getExtent();

        if (!containsExtent(mapExtent, geomExtent)) {
          const geom = ZoneLayer.getOptimizedLanelGeometry(feature, mapExtent);
          olStyles.text.setGeometry(geom);
        }
      }
    }

    return olStyles;
  }

  /**
   * Returns the style of the given feature.
   * @private
   * @param {ol.Feature} feature {@link https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html ol/Feature}
   * @param {number} resolution Map resolution.
   * @returns {ol.Style} get the feature's style function.
   */
  zoneStyle(feature, resolution) {
    const isSelected = this.selectedZones.includes(feature);
    const isHovered =
      feature.get('isClickable') && this.hoverFeature === feature;
    const styleObject = this.styleFunction(
      feature.getProperties(),
      isSelected,
      isHovered,
    );
    const olStyles = this.getOlStylesFromObject(
      styleObject,
      isSelected,
      isHovered,
      feature,
      resolution,
    );

    return Object.values(olStyles).flat();
  }

  /**
   * Clears the layer.
   */
  clear() {
    if (this.abortController && !this.abortController.signal.aborted) {
      this.abortController.abort();
    }

    this.featuresLayer.getSource().clear();
    this.labelsLayer.getSource().clear();
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
      [this.apiKeyName || 'key']: this.apiKey,
      simplify: this.simplify,
      srs: 3857,
      from: this.validFrom,
      to: this.validTo,
    };

    const url = `${this.url}/zonen?${qs.stringify(urlParams)}`;

    return fetch(url, { signal: this.abortController.signal })
      .then((res) => res.json())
      .then((data) => {
        const features = format.readFeatures(data);
        this.featuresLayer.getSource().clear();
        this.labelsLayer.getSource().clear();
        this.featuresLayer.getSource().addFeatures(features);
        this.labelsLayer.getSource().addFeatures(features);
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
    this.map
      .getView()
      .fit(this.featuresLayer.getSource().getExtent(), fitOptions);
  }

  /**
   * Load zones from a given configuration.
   * @param {Object[]} config Array of objects defining selected zones.
   * @param {number} config.partnerCode Partner code.
   * @param {Object[]} config.zones Array of zones to select.
   * @param {number} [config.zones.zoneCode] Code of zone to select.
   * @param {string} [config.zones.zoneName] Name of zone to select.
   * @param {boolean} [config.zones.isSelected] If true, the zone
   *   is initially selected.
   * @param {boolean} [config.zones.isClickable] If true, the zone
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

    return this.fetchZones({ filter: qryParams.join(',') }).then((features) => {
      // Preselect features
      for (let i = 0; i < features.length; i += 1) {
        const zoneCode = features[i].get('zone');
        const partnerCode = features[i].get('partner_code');
        // partner code can be string or int. ensure both are string.
        const partner = config.find(
          (c) => `${c.partnerCode}` === `${partnerCode}`,
        );

        if (partner) {
          const zone = partner.zones.find(
            (z) => `${z.zoneCode}` === `${zoneCode}`,
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
}

export default ZoneLayer;
