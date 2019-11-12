import ClusterSource from 'ol/source/Cluster';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import GeoJSON from 'ol/format/GeoJSON';
import ConstructionLayer from './ConstructionLayer';

class ConstructionClusterLayer extends ConstructionLayer {
  constructor(options = {}) {
    super({
      ...options,
    });

    this.onChangeVisible = this.onChangeVisible.bind(this);

    this.olLayer.setSource(
      new ClusterSource({
        distance: 90,
        source: this.olLayer.getSource(),
        geometryFunction: this.geometryFunction,
      }),
    );
  }

  addFeatures(data) {
    const format = new GeoJSON();
    const features = format.readFeatures(data);
    this.olLayer
      .getSource()
      .getSource()
      .clear();
    this.olLayer
      .getSource()
      .getSource()
      .addFeatures(features);
  }

  onChangeVisible() {
    this.olLayer
      .getSource()
      .getSource()
      .changed();
  }

  style(feature) {
    const count = feature.get('features').length;
    const cacheKey = `cluster_${count}`;

    if (!this.styleCache[cacheKey]) {
      const radius = 9 * Math.sqrt((count + 15) / Math.PI);

      this.styleCache[cacheKey] = [
        new Style({
          zIndex: 3,
          text: new Text({
            textBaseline: 'middle',
            textAlign: 'center',
            offsetY: 0,
            text: count.toString(),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 1)',
            }),
            font: 'bold 14px Arial, Verdana, Helvetica, sans-serif',
          }),
          image: new Circle({
            radius,
            fill: new Fill({
              color: 'rgba(0, 61, 133, 0.8)',
            }),
          }),
        }),
      ];
    }

    return this.styleCache[cacheKey];
  }
}

export default ConstructionClusterLayer;
