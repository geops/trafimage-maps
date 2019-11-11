import MapboxLayer from 'react-spatial/layers/MapboxLayer';

class TrafimageMapboxLayer extends MapboxLayer {
  setStyleConfig(url, key) {
    const { style } = this.options;
    const newStyleUrl = `${url}/styles/${style}/style.json?key=${key}`;

    // Don't apply style if not necessary otherwise
    // it will remove styles applies by MapboxStyleLayer layers.
    if (this.styleUrl === newStyleUrl) {
      return;
    }
    this.styleUrl = newStyleUrl;
    if (this.mbMap) {
      fetch(this.styleUrl)
        .then(response => {
          return response.json();
        })
        .then(data => {
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
}

export default TrafimageMapboxLayer;
