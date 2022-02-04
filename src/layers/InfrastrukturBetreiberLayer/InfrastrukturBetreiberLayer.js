import { MapboxStyleLayer, VectorLayer } from 'mobility-toolbox-js/ol';
import { Vector as OLVectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke } from 'ol/style';

const highlightStyle = new Style({
  stroke: new Stroke({
    color: [0, 61, 155, 0.5],
    width: 8,
  }),
  zIndex: 999,
});

/**
 * InfrastrukturBetreiberLayer
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/MapboxStyleLayer%20js~MapboxStyleLayer%20html-offset-anchor}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class InfrastrukturBetreiberLayer extends MapboxStyleLayer {
  constructor(options = {}) {
    const children = [
      // Layer for feature highlighting on click
      new VectorLayer({
        olLayer: new OLVectorLayer({
          source: new VectorSource(),
        }),
        properties: {
          hideInLegend: true,
        },
      }),
    ];
    super({ ...options, children });
    this.highlightSource = this.children[0].olLayer.getSource(); // Get vector layer source
  }

  select(feature) {
    return super.select(feature);
  }

  hightlightFeature(feature) {
    if (feature) {
      const overlayFeature = feature.clone();
      overlayFeature.setStyle(highlightStyle);
      this.highlightSource.addFeature(overlayFeature);
    }
  }

  getFeatureInfoAtCoordinate(coordinate) {
    // console.log(this);
    return super.getFeatureInfoAtCoordinate(coordinate).then((data) => {
      this.highlightSource.clear();
      this.hightlightFeature(this.selectedFeatures[0]);
      this.hightlightFeature(this.highlightedFeatures[0]);
      return data;
    });
  }
}

export default InfrastrukturBetreiberLayer;
