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
    // TODO: move to setActiveTopic
    const handicapFeatures = this.getActiveTopic()
      .layers.filter(findHandicapLayers)
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
    // TODO: zoom and select item.handicap.feature on map
    console.log(this, item);
  }
}

export default HandicapStationFinder;
