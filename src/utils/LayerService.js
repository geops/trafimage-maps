/**
 * A layer service class to handle layer adding, removing and visiblity.
 */
export default class LayerService {
  constructor(layers) {
    this.layers = layers;
  }

  getLayers() {
    return this.layers;
  }

  setLayers(layers) {
    this.layers = layers;
  }

  getLayersAsFlatArray(optLayers) {
    let layers = [];
    (optLayers || this.getLayers() || []).forEach((l) => {
      layers.push(l);
      const { children } = l;
      layers = layers.concat(this.getLayersAsFlatArray(children || []));
    });
    return layers;
  }

  getLayer(name) {
    return this.getLayersAsFlatArray().find((l) => {
      return l.name === name;
    });
  }

  getParent(child) {
    return this.getLayersAsFlatArray().find((l) => {
      return !!l.children.includes(child);
    });
  }

  getParents(child) {
    let layer = child;
    const parents = [];

    let parentLayer;
    do {
      parentLayer = this.getParent(layer);
      if (parentLayer) {
        parents.push(parentLayer);
        layer = parentLayer;
      }
    } while (parentLayer);

    return parents;
  }

  getBaseLayers() {
    return this.getLayersAsFlatArray().filter((l) => {
      return l.get('isBaseLayer');
    });
  }

  getQueryableLayers() {
    return this.getLayersAsFlatArray().filter((layer) => {
      return layer.visible && layer.get('isQueryable');
    });
  }

  getFeatureInfoAtCoordinate(coordinate, layers) {
    const promises = (layers || this.getQueryableLayers()).map((layer) => {
      return layer
        .getFeatureInfoAtCoordinate(coordinate)
        .then((featureInfo) => {
          return featureInfo;
        });
    });
    return Promise.all(promises);
  }
}
