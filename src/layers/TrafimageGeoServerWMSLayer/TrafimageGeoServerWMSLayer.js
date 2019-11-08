import WMSLayer from 'react-spatial/layers/WMSLayer';

class TrafimageGeoServerWMSLayer extends WMSLayer {
  setGeoServerWMSUrl(geoServerUrl) {
    this.olLayer.getSource().setUrl(geoServerUrl);
  }
}

export default TrafimageGeoServerWMSLayer;
