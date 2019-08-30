import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import CONF from '../../config/appConfig';

class PassagierfrequenzenLayer extends VectorLayer {
  constructor(options = {}) {
    const name = 'ch.sbb.bahnhoffrequenzen';
    const key = 'ch.sbb.bahnhoffrequenzen';

    const olLayer = new OLVectorLayer({
      // TODO HIER WEITERMACHEN
      // style: (f, r) => this.style(f, r),
      source: new OLVectorSource(),
    });

    super({
      ...options,
      name,
      key,
      olLayer,
    });

    this.url =
      `${CONF.geoserverUrl}?service=WFS&version=1.0.0&request=GetFeature` +
      '&typeName=trafimage:passagierfrequenzen&outputFormat=application%2Fjson';

    this.setVisible(this.visible);
  }

  /**
   * Set visible
   * @param {boolean} visible
   * @param {boolean} stopPropagationDown Stops propagation down.
   * @param {boolean} stopPropagationUp Stops propagation up.
   * @param {boolean} stopPropagationSiblings Stops propagation toward siblings.
   */
  setVisible(
    visible,
    stopPropagationDown = false,
    stopPropagationUp = false,
    stopPropagationSiblings = false,
  ) {
    if (visible && !this.olLayer.getSource().getFeatures().length) {
      fetch(this.url)
        .then(data => data.json())
        .then(data => {
          const format = new GeoJSON();
          const features = format.readFeatures(data);
          this.olLayer.getSource().clear();
          this.olLayer.getSource().addFeatures(features);
        });
    }

    super.setVisible(
      visible,
      stopPropagationDown,
      stopPropagationUp,
      stopPropagationSiblings,
    );
  }
}

export default PassagierfrequenzenLayer;
