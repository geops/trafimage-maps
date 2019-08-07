import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon, Circle, Fill } from 'ol/style';
import bahnhofplanLayerIcon from '../../img/bahnhofplanLayerIcon.png';
import CONF from '../../config/appConfig';

/**
 * Layer for visualizing fare networks.
 * @class BahnhofplanLayer
 */
class BahnhofplanLayer extends VectorLayer {
  constructor(options = {}) {
    let name = 'Interaktiver Bahnhofplan';
    let key = 'ch.sbb.bahnhofplaene.interaktiv';

    if (options.showPrintFeatures) {
      name = 'Printprodukte';
      key = 'ch.sbb.bahnhofplaene.printprodukte';
    }

    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
      source: new OLVectorSource(),
    });

    super({
      ...options,
      name,
      key,
      olLayer,
      radioGroup: 'bahnhofplaene',
    });

    this.url =
      `${CONF.geoserverUrl}?service=WFS&version=1.0.0&request=GetFeature` +
      '&typeName=trafimage:bahnhofplaene&outputFormat=application%2Fjson';

    this.showPrintFeatures = !!options.showPrintFeatures;

    this.setVisible(this.visible);

    this.dataResolutions = [750, 500, 250, 100, 50, 20, 10, 5];

    this.iconStyle = new Style({
      image: new Icon({
        src: bahnhofplanLayerIcon,
      }),
    });

    this.onClick(f => {
      [this.clickedFeature] = f;
      this.olLayer.changed();
    });
  }

  style(feature, resolution) {
    const vis = feature.get('visibility');
    const style = [this.iconStyle];
    // find closest data resolution
    const res = this.dataResolutions.reduce((prev, curr) =>
      Math.abs(curr - resolution) < Math.abs(prev - resolution) ? curr : prev,
    );

    if (vis < resolution * 10 || feature.get('resolution') !== res) {
      return null;
    }

    if (feature === this.clickedFeature) {
      style.unshift(
        new Style({
          image: new Circle({
            radius: 15,
            fill: new Fill({
              color: 'rgba(0, 61, 133, 0.5)',
            }),
          }),
        }),
      );
    }

    return style;
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
          let features = format.readFeatures(data);
          features = this.showPrintFeatures
            ? features
            : features.filter(f => f.get('url_interactive_plan'));
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
