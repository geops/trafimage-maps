import VectorLayer from 'react-spatial/layers/VectorLayer';
import Fill from 'ol/style/Fill';
import GeoJSON from 'ol/format/GeoJSON';
import Icon from 'ol/style/Icon';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import featureCollection from './FeatureCollection.json';

/**
 * Layer for Zweitausbildung Abroad
 * Extends {@link https://react-spatial.geops.de/docjs.html#layer geops-spatial/Layer}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ZweitausbildungAbroadLayer extends VectorLayer {
  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
      source: new OLVectorSource({
        format: new GeoJSON(),
        loader: () => {
          const format = new GeoJSON();
          const features = format.readFeatures(featureCollection);
          this.olLayer.getSource().clear();
          this.olLayer.getSource().addFeatures(features);
        },
      }),
      zIndex: options.zIndex || 0,
    });

    super({
      ...options,
      olLayer,
    });

    this.styleCache = {};

    this.setVisible(this.visible);
  }

  setLanguage(language) {
    this.language = language;
    this.olLayer.changed();
  }

  setStaticFilesUrl(staticFilesUrl) {
    this.staticFilesUrl = staticFilesUrl;
  }

  style(feature, resolution) {
    const text = feature.get(`title_${this.language}`);
    const hover = feature.get('hoverStyle');

    const fontSize = hover ? 20 : 16;

    const cacheKey = text + hover + resolution;

    if (!this.styleCache[cacheKey]) {
      this.styleCache[cacheKey] = [
        new Style({
          text: new Text({
            textBaseline: 'middle',
            textAlign: 'center',
            text,
            fill: new Fill({
              color: 'white',
            }),
            font: `${fontSize}px Arial, Verdana, Helvetica, sans-serif`,
          }),
        }),
        new Style({
          image: new Icon({
            src: `${this.staticFilesUrl}/img/layers/zweitausbildung/button_rectangle.png`,
            anchor: [0.4, 0.505],
          }),
        }),
      ];
    }
    return this.styleCache[cacheKey];
  }
}

export default ZweitausbildungAbroadLayer;
