import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon } from 'ol/style';
import LayerHelper from '../layerHelper';

/**
 * Layer for visualizing Handicap Topic.
 * @class
 * @private
 * @params {Object} options
 * @inheritdoc
 */
class InfoFPWLayer extends VectorLayer {
  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.styleFunc(f, r),
      source: new OLVectorSource({
        format: new GeoJSON(),
        loader: () => {
          fetch(
            `${this.geoJsonCacheUrl}?` +
              'layer=infofpw_haltestellen&workspace=trafimage' +
              '&srsName=EPSG:3857&geoserver=wkp',
          )
            .then(data => data.json())
            .then(data => {
              const format = new GeoJSON();
              const features = format.readFeatures(data);
              this.olLayer.getSource().clear();
              this.olLayer.getSource().addFeatures(features);
            });
        },
      }),
    });

    super({
      ...options,
      olLayer,
    });

    this.styleFunc = this.styleFunc.bind(this);

    this.style = new Style({
      image: new Icon({
        src: `${process.env.REACT_APP_STATIC_FILES_URL}/img/layers/infofpw/IH_Bahnhof.png`,
      }),
    });

    this.setVisible(this.visible);
  }

  setGeoJsonUrl(geoJsonCacheUrl) {
    this.geoJsonCacheUrl = geoJsonCacheUrl;
  }

  /**
   * Create Style from feature
   * @param {ol.feature} feature
   * @returns {Object|null}
   */
  styleFunc(feature, resolution) {
    const res = LayerHelper.getDataResolution(resolution);
    if (feature.get('resolution') === res) {
      if (feature.get('visibility') >= res * 10) {
        return this.style;
      }
    }
    return null;
  }
}

export default InfoFPWLayer;
