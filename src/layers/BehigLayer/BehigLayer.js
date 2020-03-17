import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { unByKey } from 'ol/Observable';
import LayerHelper from '../layerHelper';

/**
 * Layer for behig
 * Extends {@link https://react-spatial.geops.de/docjs.html#layer geops-spatial/Layer}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class BehigLayer extends VectorLayer {
  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
      source: new OLVectorSource({
        format: new GeoJSON(),
        loader: () => {
          fetch(
            `${this.geoJsonCacheUrl}?` +
              'layer=behig_konformitaet&workspace=trafimage' +
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

    this.toggleLayers = options.toggleLayers || [];

    this.styleCache = {};
    this.visibilityKeys = [];

    this.onChangeVisible = this.onChangeVisible.bind(this);
    this.geometryFunction = this.geometryFunction.bind(this);

    this.setVisible(this.visible);
  }

  init(map) {
    super.init(map);

    this.visibilityKeys.push(
      this.toggleLayers.map(toggleLayer => {
        return toggleLayer.on('change:visible', this.onChangeVisible);
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

  setStaticFilesUrl(staticFilesUrl) {
    this.staticFilesUrl = staticFilesUrl;
  }

  /**
   * Function that returns a geometry if the feature should be visible.
   * @param  {ol.feature} feature Feature
   * @return {ol.geom.Point} Geometry or null
   */
  geometryFunction(feature) {
    const toggleLayer = this.toggleLayers.find(
      layer =>
        layer.properties &&
        layer.properties.behig &&
        layer.properties.behig.status === feature.get('status'),
    );

    return toggleLayer && toggleLayer.getVisible()
      ? feature.getGeometry()
      : null;
  }

  style(feature, resolution) {
    if (!this.geometryFunction(feature)) {
      return null;
    }

    const res = LayerHelper.getDataResolution(resolution);
    if (feature.get('resolution') === res) {
      const status = feature.get('status');
      const cacheKey = status;

      if (!this.styleCache[cacheKey]) {
        const filename = status.replace(/[^A-Z,^0-9,-_]/gi, '_');

        this.styleCache[cacheKey] = [
          new Style({
            zIndex: 3,
            image: new Icon({
              src: `${this.staticFilesUrl}/img/layers/behig/${filename}.png`,
            }),
          }),
        ];
      }
      if (feature.get('visibility') >= res * 10) {
        return this.styleCache[cacheKey];
      }
    }
    return null;
  }
}

export default BehigLayer;
