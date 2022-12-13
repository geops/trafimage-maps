const getLayersAsFlatArray = (optLayers = []) => {
  let layers = [];
  optLayers.forEach((l) => {
    layers.push(l);
    const { children } = l;
    layers = layers.concat(getLayersAsFlatArray(children));
  });
  return layers;
};

export default getLayersAsFlatArray;
