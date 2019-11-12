import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import ConstructionLayer from './ConstructionLayer';

class ConstructionSingleLayer extends ConstructionLayer {
  constructor(options = {}) {
    super({
      ...options,
    });

    this.getSource = this.getSource.bind(this);
  }

  getSource() {
    return this.olLayer.getSource();
  }

  style(feature) {
    if (!this.geometryFunction(feature)) {
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
