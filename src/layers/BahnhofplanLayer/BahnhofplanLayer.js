import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon } from 'ol/style';
import bahnhofplanLayerIcon from '../../img/bahnhofplanLayerIcon.png';

class BahnhofplanLayer extends VectorLayer {
  constructor(options = {}) {
    const name = options.showPrintFeatures
      ? 'Printprodukte'
      : 'Interaktiver Bahnhofplan';
    const key = options.showPrintFeatures
      ? 'ch.sbb.bahnhofplane.printproduke'
      : 'ch.sbb.bahnhofplaene.interaktiv';
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
      source: new OLVectorSource(),
    });

    super({
      ...options,
      ...{ name, key, olLayer, radioGroup: 'bahnhofplaene' },
    });

    this.url =
      'http://maps.trafimage.ch/geoserver/trafimage/ows' +
      '?service=WFS&version=1.0.0&request=GetFeature' +
      '&typeName=trafimage:bahnhofplaene&outputFormat=application%2Fjson';

    this.showPrintFeatures = !!options.showPrintFeatures;
    this.setVisible(this.visible);

    this.iconStyle = new Style({
      image: new Icon({
        src: bahnhofplanLayerIcon,
      }),
    });
  }

  style(feature, resolution) {
    const vis = feature.get('visibility');
    if (vis !== 50) {
      return null;
    }

    if (this.showPrintFeatures) {
      if (!feature.get('url_a4') && !feature.get('url_poster')) {
        return null;
      }
    } else if (!feature.get('url_interactive_plan')) {
      return null;
    }

    return this.iconStyle;
  }

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

export default BahnhofplanLayer;
