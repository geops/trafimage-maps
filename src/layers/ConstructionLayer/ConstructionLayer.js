import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { unByKey } from 'ol/Observable';

/**
 * Base layer for construction
 * Extends {@link https://react-spatial.geops.de/docjs.html#layer geops-spatial/Layer}
 * @class
 * @param {Object} [options] Layer options.
 */
class ConstructionLayer extends VectorLayer {
  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
      source: new OLVectorSource({
        projection: 'EPSG:3857',
        format: new GeoJSON({
          featureProjection: 'EPSG:3857',
          dataProjection: 'EPSG:3857',
        }),
        loader: () => {
          fetch(
            `${this.geoServerUrl}?` +
              'service=WFS&version=1.0.0&request=GetFeature&' +
              'typeName=trafimage:bahnausbauten&' +
              'srsName=EPSG:3857&' +
              'outputFormat=application/json',
          )
            .then(data => data.json())
            .then(data => {
              const format = new GeoJSON();
              const features = format.readFeatures(data);
              this.getSource().clear();
              this.getSource().addFeatures(features);
            });
        },
      }),
      minResolution: options.minResolution,
      maxResolution: options.maxResolution,
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
    this.getSource().changed();
  }

  setGeoServerUrl(geoServerUrl) {
    this.geoServerUrl = geoServerUrl;
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
        child.properties.construction &&
        child.properties.construction.art === feature.get('art') &&
        child.properties.construction.ort === feature.get('ort'),
    );

    return childLayer && childLayer.getVisible() ? feature.getGeometry() : null;
  }
}

export default ConstructionLayer;
