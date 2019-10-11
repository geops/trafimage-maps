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
 * Layer for visualizing information about stations (default) or airports.
 * The popup contains links to station plans, station coordinates
 * and links to timetable, services, shopping, handicap information.
 *
 * Extends {@link https://react-spatial.geops.de/docjs.html#vectorlayer geops-spatial/layers/VectorLayer}
 * @class
 * @param {Object} [options] Layer options.
 * @param {boolean} [showAirports] True to show the airports instead of stations
 * @param {boolean} [useBboxStrategy] Use the the [bbox loading strategy](https://openlayers.org/en/latest/apidoc/module-ol_loadingstrategy.html#.bbox)
 * @inheritdoc
 */
class NetzkartePointLayer extends VectorLayer {
  constructor(options = {}) {
    let name = 'ch.sbb.netzkarte.stationen';
    let key = 'ch.sbb.netzkarte.stationen';

    if (options.showAirports) {
      name = 'ch.sbb.netzkarte.flughafen';
      key = 'ch.sbb.netzkarte.flughafen';
    }

    const olLayer = new OLVectorLayer({
      source: new OLVectorSource({
        format: new OLGeoJSON(),
        ...(options.useBboxStrategy ? { strategy: OLBboxStrategy } : {}),
      }),
    });

    super({
      ...options,
      name,
      key,
      olLayer,
      radioGroup: 'stations',
    });

    this.showAirports = !!options.showAirports;
    this.useBboxStrategy = !!options.useBboxStrategy;
    this.highlightFeature = null;

    this.url = `${CONF.geoserverUrl}?`;
    this.urlParams = {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: options.showAirports
        ? 'trafimage:netzkarte_airport_point'
        : 'trafimage:netzkarte_point',
    };

    this.defaultStyle = new OLStyle({
      image: new OLCircle({
        radius: 10,
        fill: new OLFill({
          color: 'rgba(255,255,255,0.01)',
        }),
      }),
    });

    this.highlightStyle = new OLStyle({
      image: new OLCircle({
        radius: 10,
        fill: new OLFill({
          color: 'rgba(0,61,155,0.5)',
        }),
      }),
    });

    this.olLayer.setStyle((f, r) => this.styleFunction(f, r));
    this.olLayer.getSource().setLoader(this.loader.bind(this));
    this.onClick(features => {
      this.highlightFeature = features.length ? features[0] : null;
      this.olLayer.getSource().changed();
    });
  }

  /**
   * Create Style from feature and resolution
   * @private
   * @param {ol.feature} f {@link https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html ol/Feature}
   * @param {number} r The views resolution
   * @returns {Object|null} Style
   */
  styleFunction(f, r) {
    const res = layerHelper.getDataResolution(r);
    if (f.get('resolution') === res && f.get('visibility') >= res * 10) {
      if (f === this.highlightFeature) {
        return this.highlightStyle;
      }

      return this.defaultStyle;
    }

    return null;
  }

  /**
   * Initialize the layer and listen to feature clicks.
   * @param {ol.map} map {@link https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html ol/map}
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
   * Custom loader
   * @private
   * Use a custom loader as our geoserver delivers the geojson with the legacy crs syntax
   * (similar to https://osgeo-org.atlassian.net/browse/GEOS-5996)
   * which results in an Assertion error 36, https://openlayers.org/en/latest/doc/errors/
   *
   * By using a custom the projection in the geojson does not matter
   * (compared to https://github.com/openlayers/openlayers/blob/v5.3.0/src/ol/featureloader.js#L88)
   *
   * This loader function is based on the loader example in
   * https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
   * @param {ol.extent} extent The desired extent {@link https://openlayers.org/en/latest/apidoc/module-ol_extent.html ol/extent}
   * @param {number} resolution The desired resolution for the loaded map.
   * @param {ol.proj} projection The desired projecition.
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
