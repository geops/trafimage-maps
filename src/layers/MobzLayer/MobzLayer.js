import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { unByKey } from 'ol/Observable';
import LayerHelper from '../layerHelper';

/**
 * Layer for mobz
 * Extends {@link https://react-spatial.geops.de/docjs.html#layer geops-spatial/Layer}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class MobzLayer extends VectorLayer {
  constructor(options = {}) {
    const suffix = options.properties.mobzWhatIf ? '_what_if' : '';

    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
      source: new OLVectorSource({
        format: new GeoJSON(),
        loader: () => {
          fetch(
            `${this.geoJsonCacheUrl}?` +
              `layer=mobz${suffix}_haltestellen&workspace=trafimage` +
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

    this.styleCache = {};
    this.visibilityKeys = [];

    this.onChangeVisible = this.onChangeVisible.bind(this);
    this.geometryFunction = this.geometryFunction.bind(this);

    this.setVisible(this.visible);
  }

  init(map) {
    super.init(map);

    this.visibilityKeys.push(
      this.children.map(childLayer => {
        return childLayer.on('change:visible', this.onChangeVisible);
      }),
    );
  }

  terminate() {
    super.terminate();

    if (this.visibilityKeys.length) {
      unByKey(this.visibilityKeys);
    }
  }

  onChangeVisible() {
    this.olLayer.getSource().changed();
  }

  setGeoJsonUrl(geoJsonCacheUrl) {
    this.geoJsonCacheUrl = geoJsonCacheUrl;
  }

  /**
   * Function that returns a geometry if the feature should be visible.
   * @param  {ol.feature} feature Feature
   * @return {ol.geom.Point} Geometry or null
   */
  geometryFunction(feature) {
    const childLayer = this.children.find(
      child =>
        child.properties &&
        child.properties.mobz &&
        child.properties.mobz.category === feature.get('kategorisierung'),
    );

    return childLayer && childLayer.getVisible() ? feature.getGeometry() : null;
  }

  style(feature, resolution) {
    if (!this.geometryFunction(feature)) {
      return null;
    }

    const res = LayerHelper.getDataResolution(resolution);

    if (feature.get('resolution') === res) {
      const category = feature.get('kategorisierung');

      if (!this.styleCache[category]) {
        this.styleCache[category] = [
          new Style({
            zIndex: 3,
            image: new Icon({
              src: `${process.env.REACT_APP_STATIC_FILES_URL}/img/layers/mobz/${category}.png`,
            }),
          }),
        ];
      }
      if (feature.get('visibility') >= res * 10) {
        return this.styleCache[category];
      }
    }
    return null;
  }
}

export default MobzLayer;
