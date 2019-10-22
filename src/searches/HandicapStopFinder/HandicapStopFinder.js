import HandicapLayer from '../../layers/HandicapLayer';
import StopFinder from '../StopFinder';

const findHandicapLayers = l => l instanceof HandicapLayer;
const getHandicapFeatures = layer =>
  layer.olLayer
    .getSource()
    .getFeatures()
    .map(feature => ({ didok: feature.getProperties().didok, feature, layer }));

class HandicapStopFinder extends StopFinder {
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
                hf =>
                  hf.didok ===
                  f.properties.identifiers.find(i => i.source === 'sbb:ibnr')
                    .value,
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

export default HandicapStopFinder;
