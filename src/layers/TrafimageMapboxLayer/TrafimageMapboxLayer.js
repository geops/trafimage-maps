import MapboxLayer from 'react-spatial/layers/MapboxLayer';

class TrafimageMapboxLayer extends MapboxLayer {
  setStyleConfig(url, key) {
    const { style } = this.options;
    const newStyleUrl = `${url}/styles/${style}/style.json?key=${key}`;

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
      .then(response => {
        return response.json();
      })
      .then(data => {
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
}

export default TrafimageMapboxLayer;
