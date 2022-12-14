const getFeatureInfoAtCoordinate = (coordinate, layers) => {
  const promises = layers.map((layer) => {
    return layer.getFeatureInfoAtCoordinate(coordinate).then((featureInfo) => {
      return featureInfo;
    });
  });
  return Promise.all(promises);
};

export default getFeatureInfoAtCoordinate;
