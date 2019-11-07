import MapboxLayer from 'react-spatial/layers/MapboxLayer';

class TrafimageMapboxLayer extends MapboxLayer {
  setStyleConfig(url, key) {
    const { style } = this.options;
    this.styleUrl = `${url}/styles/${style}/style.json?key=${key}`;
    // console.log('this.mbMap', this.mbMap, this.mbMap.style);
    if (this.mbMap) {
      console.log('setStyle', this.styleUrl);
      this.mbMap.setStyle(this.styleUrl);
    }
  }
}

export default TrafimageMapboxLayer;
