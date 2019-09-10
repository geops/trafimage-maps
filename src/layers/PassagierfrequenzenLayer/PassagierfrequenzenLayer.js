import qs from 'querystring';
import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import { Style, Stroke, Circle, Fill } from 'ol/style';
import OLGeoJSON from 'ol/format/GeoJSON';
import CONF from '../../config/appConfig';
import layerHelper from '../layerHelper';

class PassagierfrequenzenLayer extends VectorLayer {
  constructor(options = {}) {
    const name = 'ch.sbb.bahnhoffrequenzen';
    const key = 'ch.sbb.bahnhoffrequenzen';

    const olLayer = new OLVectorLayer({
      source: new OLVectorSource(),
    });

    super({
      ...options,
      name,
      key,
      olLayer,
      properties: {
        hasInfos: true,
        description: 'ch.sbb.bahnhoffrequenzen-desc',
      },
    });

    this.styleCache = {};

    this.url = `${CONF.geoserverUrl}?`;
    this.urlParams = {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'trafimage:passagierfrequenzen',
    };
    this.olLayer.setStyle((f, r) => this.styleFunction(f, r));
    this.olLayer.getSource().setLoader(this.loader.bind(this));

    this.onClick(f => {
      const [clickedFeature] = f;
      this.clickedFeatureName = clickedFeature && clickedFeature.get('name');
      this.olLayer.changed();
    });
  }

  styleFunction(feature, resolution) {
    const vis = feature.get('visibility');
    const res = layerHelper.getDataResolution(resolution);
    const name = feature.get('name');
    const selected = this.clickedFeatureName === name;

    if (vis < resolution * 10 || feature.get('resolution') !== res) {
      return null;
    }

    this.styleCache[res] = this.styleCache[res] || {};
    this.styleCache[res][name] = this.styleCache[res][name] || {};

    if (!this.styleCache[res][name][selected]) {
      const dwv = Math.abs(feature.get('dwv'));
      const scale = Math.min(10, 1 / (res / 750));
      const radius = Math.max(8, Math.sqrt((dwv / 400) * scale));

      let opacity = 0.7;

      if (selected) {
        opacity = 1;
      }

      this.styleCache[res][name][selected] = new Style({
        zIndex: Math.max(2, 100 / radius),
        image: new Circle({
          radius,
          fill: new Fill({
            color: 'rgba(255,220,0,{o})'.replace('{o}', opacity),
          }),
          stroke: new Stroke({
            width: 1,
            color: opacity >= 1 ? 'rgb(200,170,1)' : 'rgb(210,180,0)',
          }),
        }),
      });
    }
    return this.styleCache[res][name][selected];
  }

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
    const proj = projection.getCode();

    const urlParams = {
      ...this.urlParams,
      srsname: proj,
      outputFormat: 'application/json',
    };
    const url = `${this.url}${qs.stringify(urlParams)}`;

    fetch(url)
      .then(data => data.json())
      .then(data => {
        const format = new OLGeoJSON();
        const features = format.readFeatures(data);
        this.olLayer.getSource().clear();
        this.olLayer.getSource().addFeatures(features);
      })
      .catch(() => {
        this.olLayer.getSource().removeLoadedExtent(extent);
      });
  }
}

export default PassagierfrequenzenLayer;
