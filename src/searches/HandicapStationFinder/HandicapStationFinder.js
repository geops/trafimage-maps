import HandicapLayer from '../../layers/HandicapLayer';
import StationFinder from '../StationFinder';

const findHandicapLayers = l => l instanceof HandicapLayer;
const getHandicapFeatures = layer =>
  layer.olLayer
    .getSource()
    .getFeatures()
    .map(feature => ({ didok: feature.getProperties().didok, feature, layer }));

class HandicapStationFinder extends StationFinder {
  search(value) {
    const handicapFeatures = this.props.activeTopic.layers
      .filter(findHandicapLayers)
      .map(getHandicapFeatures)
      .flat();
    return super.search(value).then(features =>
      features
        ? features
            .map(f => ({
              ...f,
              handicap: handicapFeatures.find(
                hf => hf.didok === f.properties.ibnr,
              ),
            }))
            .filter(f => f.handicap)
        : [],
    );
  }

  select(item) {
    this.props.dispatchSetClickedFeatureInfo([
      { features: [item.handicap.feature], layer: item.handicap.layer },
    ]);
  }
}

export default HandicapStationFinder;
