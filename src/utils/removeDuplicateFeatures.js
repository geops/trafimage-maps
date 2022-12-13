export const getId = (feat) => feat.getId() || feat.get('id');

export const removeDuplicateFeatures = (featureArray = []) => {
  return featureArray.reduce((final, feat) => {
    return final.find((f) => getId(f) === getId(feat))
      ? final
      : [...final, feat];
  }, []);
};

export default removeDuplicateFeatures;
