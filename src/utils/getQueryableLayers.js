import getLayersAsFlatArray from './getLayersAsFlatArray';

const getQueryableLayers = (featureInfoEventType, layers, map) => {
  return getLayersAsFlatArray(layers).filter((layer) => {
    let isQueryable =
      layer.visible &&
      layer.get('isQueryable') &&
      (
        layer.get('featureInfoEventTypes') || ['pointermove', 'singleclick']
      ).includes(featureInfoEventType);

    if (typeof layer.get('isQueryable') === 'function') {
      isQueryable = layer.get('isQueryable')(map);
    }
    return isQueryable;
  });
};

export default getQueryableLayers;
