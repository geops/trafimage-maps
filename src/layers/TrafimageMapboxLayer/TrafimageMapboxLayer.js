import MapboxLayer from 'react-spatial/layers/MapboxLayer';

class TrafimageMapboxLayer extends MapboxLayer {
  init(map) {
    super.init(map);

    if (this.map) {
      this.dispatchEvent({
        type: 'init',
        target: this,
      });
    }

    // Set zIndex if specified
    if (this.options && this.options.zIndex) {
      this.olLayer
        .getLayersArray()
        .forEach((layer) => layer.setZIndex(this.options.zIndex));
    }
  }

  terminate(map) {
    super.terminate(map);

    this.dispatchEvent({
      type: 'terminate',
      target: this,
    });
  }

  setStyleConfig(url, key) {
    if (!url) {
      return;
    }
    const { style, url: url2 } = this.options;
    const newStyleUrl =
      url2 || `${url}/styles/${style}/style.json${key ? `?key=${key}` : ''}`;

    // Don't apply style if not necessary otherwise
    // it will remove styles apply by MapboxStyleLayer layers.
    if (this.styleUrl === newStyleUrl) {
      return;
    }
    if (!this.mbMap) {
      // The mapbox map does not exist so we only set the good styleUrl.
      this.styleUrl = newStyleUrl;
      return;
    }

    fetch(newStyleUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Ensure we don't reload the style for nothing.
        if (this.styleUrl === newStyleUrl) {
          return;
        }
        this.styleUrl = newStyleUrl;
        if (!this.mbMap) {
          return;
        }
        this.mbMap.setStyle(data);
        this.mbMap.once('styledata', () => {
          this.dispatchEvent({
            type: 'change:styleurl',
            target: this,
          });
        });
      });
  }

  getFeatures({ source, sourceLayer, filter } = {}) {
    const { mbMap } = this;
    // Ignore the getFeatureInfo until the source is loaded
    if (!mbMap || !mbMap.isSourceLoaded(source)) {
      return [];
    }
    return mbMap.querySourceFeatures(source, {
      sourceLayer,
      filter,
    });
  }
}

export default TrafimageMapboxLayer;
