import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import layerHelper from '../layerHelper';

/**
 * Layer for zweitausbildung routes
 * Extends {@link https://react-spatial.geops.de/docjs.html#layer geops-spatial/Layer}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ZweitausbildungRoutesLayer extends VectorLayer {
  /**
   * Create a dashed line style for the given colors
   * @param  {String} colors Semicolon separated list of colors
   * @return {Array<ol.style.Style>} Style
   */
  static createDashedLinesStyle(colors) {
    const style = [];
    const colorArray = colors.split(';');
    const len = 8;

    for (let i = 0; i < colorArray.length; i += 1) {
      style.push(
        new Style({
          stroke: new Stroke({
            color: colorArray[i],
            width: 4,
            lineCap: 'butt',
            lineDash: [0, i * len, len, (colorArray.length - i - 1) * len],
          }),
        }),
      );
    }

    return style;
  }

  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
    });

    super({
      ...options,
      olLayer,
    });

    this.styleCache = {};
    this.setVisible(this.visible);

    this.zweitProps = this.get('zweitausbildung') || {};
    const layerParam = this.zweitProps.layer
      ? `layer=${this.zweitProps.layer}&`
      : '';

    this.source = new OLVectorSource({
      format: new GeoJSON(),
      loader: () => {
        fetch(
          `${this.geoJsonCacheUrl}?` +
            `${layerParam}workspace=trafimage` +
            '&srsName=EPSG:3857&geoserver=wkp',
        )
          .then((data) => data.json())
          .then((data) => {
            const format = new GeoJSON();
            const features = format.readFeatures(data);
            this.olLayer.getSource().clear();
            this.olLayer.getSource().addFeatures(features);
          });
      },
    });

    olLayer.setSource(this.source);
  }

  setGeoJsonUrl(geoJsonCacheUrl) {
    this.geoJsonCacheUrl = geoJsonCacheUrl;
  }

  style(feature, resolution) {
    const colors = feature.get('colors');
    const network = feature.get('network');

    const currentNetwork = `trackit${layerHelper.getOldGeneralization(
      resolution,
    )}`;
    const visible = network === currentNetwork;

    const styleName = visible ? colors : visible;

    if (!this.styleCache[styleName]) {
      if (visible) {
        this.styleCache[
          styleName
        ] = ZweitausbildungRoutesLayer.createDashedLinesStyle(colors);
      } else {
        this.styleCache[styleName] = new Style();
      }
    }

    return this.styleCache[styleName];
  }
}

export default ZweitausbildungRoutesLayer;
