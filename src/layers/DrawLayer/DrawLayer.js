import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import { VectorLayer } from 'mobility-toolbox-js/ol';

class DrawLayer extends VectorLayer {
  constructor(options = {}) {
    super({
      name: 'Draw layer',
      key: 'draw',
      properties: {
        hideInLegend: true,
        popupComponent: 'DrawPopup',
      },
      olLayer: new OLVectorLayer({
        source: new VectorSource({
          features: [],
        }),
        style: () => {
          return new Style({
            zIndex: 10000,
            image: new Circle({
              radius: 15,
              fill: new Fill({
                color: 'rgba(0, 61, 133, 0.8)',
              }),
            }),
          });
        },
      }),
      ...options,
    });
  }

  getFeatureInfoAtCoordinate(coordinate) {
    // We want popup only for old wkp kml that contains adescription.
    return super.getFeatureInfoAtCoordinate(coordinate).then((featureInfos) => {
      const features = featureInfos.features.filter((feature) =>
        feature.get('description'),
      );
      return { ...featureInfos, features };
    });
  }
}

export default DrawLayer;
