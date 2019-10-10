import qs from 'querystring';
import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import { Style, Stroke, Circle, Fill } from 'ol/style';
import OLGeoJSON from 'ol/format/GeoJSON';
import CONF from '../../config/appConfig';
import layerHelper from '../layerHelper';

/**
 * Layer for visualizing the number of people who use the railway.
 *
 * Extends {@link https://react-spatial.geops.de/docjs.html#vectorlayer geops-spatial/layers/VectorLayer}
 * @class
 * @param {Object} [options] Layer options.
 * @inheritdoc
 */
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

    this.url = `${CONF.geoserverCachedUrl}?`;
    this.urlParams = {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      layer: 'passagierfrequenzen',
      workspace: 'trafimage',
      geoserver: 'wkp',
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
