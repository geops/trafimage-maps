const getFeatureInfoAtCoordinate = (coordinate, layers, eventType) => {
  const promises = layers.map((layer) => {
    return layer
      .getFeatureInfoAtCoordinate(coordinate, eventType)
      .then((featureInfo) => {
        return featureInfo;
      });
  });
  return Promise.all(promises);
};

export default getFeatureInfoAtCoordinate;
