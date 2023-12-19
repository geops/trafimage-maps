import OLVectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { VectorLayer } from "mobility-toolbox-js/ol";

class DrawLayer extends VectorLayer {
  constructor(options = {}) {
    super({
      name: "Draw layer",
      key: "draw",
      properties: {
        isQueryable: true,
        hasInfos: true,
        hideInLegend: true,
        popupComponent: "DrawPopup",
        layerInfoComponent: "DrawLayerInfo",
      },
      olLayer: new OLVectorLayer({
        zIndex: 10, // On top of the layers
        source: new VectorSource({
          features: [],
        }),
      }),
      ...options,
    });
  }

  getFeatureInfoAtCoordinate(coordinate) {
    // We want popup only for old wkp kml that contains adescription.
    return super.getFeatureInfoAtCoordinate(coordinate).then((featureInfos) => {
      const features = featureInfos.features.filter((feature) =>
        feature.get("description"),
      );
      return { ...featureInfos, features };
    });
  }
}

export default DrawLayer;
