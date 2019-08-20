import qs from 'querystring';
import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import OLGeoJSON from 'ol/format/GeoJSON';
import { bbox as OLBboxStrategy } from 'ol/loadingstrategy';
import { Style as OLStyle, Circle as OLCircle, Fill as OLFill } from 'ol/style';
import CONF from '../../config/appConfig';
import layerHelper from '../layerHelper';

/**
 * Layer for visualizing network points.
 * Extends {@link https://react-spatial.geops.de/docjs.html#vectorlayer geops-spatial/layers/VectorLayer}
 * @class
 * @params {Object} options
 * @inheritdoc
 */
class NetzkartePointLayer extends VectorLayer {
  constructor(options = {}) {
    let name = 'Stationen';
    let key = 'ch.sbb.stationen';

    if (options.showAirports) {
      name = 'Flughäfen';
      key = 'ch.sbb.flughafen';
    }

    const vectorSource = new OLVectorSource({
      format: new OLGeoJSON(),
      ...(options.useBboxStrategy ? { strategy: OLBboxStrategy } : {}),
    });

    const olLayer = new OLVectorLayer({
      source: vectorSource,
    });

    super({
      ...options,
      name,
      key,
      olLayer,
      radioGroup: 'stations',
    });

    // Options
    this.showAirports = !!options.showAirports;
    this.useBboxStrategy = !!options.useBboxStrategy;

    // Bindings
    this.loader = this.loader.bind(this);

    // Style
    this.netzkarteStyleCache = {};
    olLayer.setStyle(
      options.showAirports ? this.airportStyle : this.defaultStyle,
    );

    // Url
    this.url = `${CONF.geoserverUrl}?`;
    this.urlParams = {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: options.showAirports
        ? 'trafimage:netzkarte_airport_point'
        : 'trafimage:netzkarte_point',
    };

    // Set loader after binding
    vectorSource.setLoader(this.loader);
  }

  /**
   * Initialize the layer and listen to feature clicks.
   * @param {ol.map} map {@link https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html ol/Map}
   */
  init(map) {
    super.init(map);
    this.map = map;

    // Clear the layer when the resolution changes
    // as the WFS is resolution dependent
    this.map.getView().on('change:resolution', () => {
      this.olLayer.getSource().clear();
    });
  }

  /**
   * Create airport style from feature and resolution
   * @param {ol.feature} feature
   * @param {number} resolution
   * @returns {Object|null}
   */
  airportStyle = (feature, resolution) => {
    const res = layerHelper.getDataResolution(resolution);
    if (
      feature.get('resolution') === res &&
      feature.get('visibility') >= res * 10
    ) {
      return this.defaultStyle(feature, resolution);
    }
    return null;
  };

  /**
   * Returns default style for feature
   * @param {ol.feature} feature
   * @returns {Object}
   */
  defaultStyle = feature => {
    const layer = feature.get('layer');
    if (!this.netzkarteStyleCache[layer]) {
      let zIndex = layer === 'Zug' ? 1 : 0;

      switch (layer) {
        case 'Zug':
          zIndex = 2;
          break;
        case 'Tram':
          zIndex = 1;
          break;
        default:
          zIndex = 0;
      }

      this.netzkarteStyleCache[layer] = [
        new OLStyle({
          zIndex,
          image: new OLCircle({
            radius: 10,
            fill: new OLFill({
              color: 'rgba(255,255,255,0.01)',
            }),
          }),
        }),
      ];
    }
    return this.netzkarteStyleCache[layer];
  };

  /**
   * Use a custom loader as our geoserver delivers the geojson with the legacy crs syntax
   * (similar to https://osgeo-org.atlassian.net/browse/GEOS-5996)
   * which results in an Assertion error 36, https://openlayers.org/en/latest/doc/errors/
   *
   * By using a custom the projection in the geojson does not matter
   * (compared to https://github.com/openlayers/openlayers/blob/v5.3.0/src/ol/featureloader.js#L88)
   *
   * This loader function is based on the loader example in
   * https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
   */
  loader(extent, resolution, projection) {
    const res = layerHelper.getDataResolution(resolution);
    const proj = projection.getCode();

    const urlParams = {
      ...this.urlParams,
      ...(this.useBboxStrategy ? { bbox: `${extent.join(',')},${proj}` } : {}),
      srsname: proj,
      ...(!this.showAirports ? { viewparams: `resolution:${res}` } : {}),
      outputFormat: 'application/json',
    };

    const url = `${this.url}${qs.stringify(urlParams)}`;

    fetch(url)
      .then(data => data.json())
      .then(data => {
        this.olLayer.getSource().addFeatures(
          this.olLayer
            .getSource()
            .getFormat()
            .readFeatures(data),
        );
      })
      .catch(() => {
        this.olLayer.getSource().removeLoadedExtent(extent);
      });
  }
}

export default NetzkartePointLayer;
