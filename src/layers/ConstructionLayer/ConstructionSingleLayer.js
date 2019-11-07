import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import GeoJSON from 'ol/format/GeoJSON';
import ConstructionLayer from './ConstructionLayer';

class ConstructionSingleLayer extends ConstructionLayer {
  constructor(options = {}) {
    super({
      ...options,
    });

    this.onChangeVisible = this.onChangeVisible.bind(this);
  }

  addFeatures(data) {
    const format = new GeoJSON();
    const features = format.readFeatures(data);
    this.olLayer.getSource().clear();
    this.olLayer.getSource().addFeatures(features);
  }

  onChangeVisible() {
    this.olLayer.getSource().changed();
  }

  style(feature) {
    if (!this.isFeatureVisible(feature)) {
      return null;
    }

    const cacheKey = `${feature.get('art')}_${feature.get('ort')}`;
    const filename = `${feature.get('art')}_${feature.get('ort')}`.replace(
      /[^A-Z,^0-9,-_]/gi,
      '',
    );

    if (!this.styleCache[cacheKey]) {
      this.styleCache[cacheKey] = [
        new Style({
          image: new Icon({
            src: `/img/layers/construction/${filename}.png`,
          }),
        }),
      ];
    }

    return this.styleCache[cacheKey];
  }
}

export default ConstructionSingleLayer;
