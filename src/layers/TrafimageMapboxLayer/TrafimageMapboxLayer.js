import MapboxLayer from 'react-spatial/layers/MapboxLayer';

class TrafimageMapboxLayer extends MapboxLayer {
  setStyleConfig(url, key) {
    const { style } = this.options;
    this.styleUrl = `${url}/styles/${style}/style.json?key=${key}`;
    if (this.mbMap) {
      this.mbMap.setStyle(this.styleUrl);
    }
  }
}

export default TrafimageMapboxLayer;
