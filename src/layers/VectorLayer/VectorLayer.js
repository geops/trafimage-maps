import { MobilityLayerMixin } from "mobility-toolbox-js/ol";
import OLVectorLayer from "ol/layer/Vector";

class VectorLayer extends MobilityLayerMixin(OLVectorLayer) {
  constructor(options = {}) {
    super({
      ...options,
    });
  }

  getFeatureInfoAtCoordinate(coordinate) {
    const pixel = this.map?.getPixelFromCoordinate(coordinate);
    const features = this.map?.getFeaturesAtPixel(pixel, {
      layerFilter: (l) => l === this,
      hitTolerance: this.get("hitTolerance") || 5,
    });

    return Promise.resolve({
      features,
      layer: this,
      coordinate,
    });
  }

  clone(newOptions) {
    return new VectorLayer({
      ...(this.options || {}),
      ...(newOptions || {}),
    });
  }
}

export default VectorLayer;
