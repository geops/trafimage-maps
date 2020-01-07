import HandicapLayer from '../../layers/HandicapLayer';
import StopFinder from '../StopFinder';

const findHandicapLayers = l => l instanceof HandicapLayer;
const getHandicapFeatures = layer =>
  layer.olLayer
    .getSource()
    .getFeatures()
    .map(feature => ({ didok: feature.getProperties().didok, feature, layer }));

/**
 * Search for handicap stations which are not a 'Stützpunktbahnhof'.
 * This search will be removed after handicap information for all stations has
 * been added to cartaro.
 */
class HandicapNoInfoFinder extends StopFinder {
  constructor() {
    super();
    this.showInPlaceholder = false;
  }

  search(value) {
    const handicapFeatures = this.props.activeTopic.layers
      .filter(findHandicapLayers)
      .map(getHandicapFeatures)
      .flat();

    return super
      .search(value)
      .then(features =>
        features
          ? features.filter(
              f => !handicapFeatures.find(hf => hf.didok === f.properties.id),
            )
          : [],
      );
  }
}

export default HandicapNoInfoFinder;
