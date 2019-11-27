import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLLayerGroup from 'ol/layer/Group';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import { unByKey } from 'ol/Observable';

/**
 * Layer for construction
 * Extends {@link https://react-spatial.geops.de/docjs.html#layer geops-spatial/Layer}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ConstructionLayer extends VectorLayer {
  constructor(options = {}) {
    const singleLayer = new OLVectorLayer({
      style: (f, r) => this.styleSingle(f, r),
      maxResolution: 305.748113141,
    });

    const clusterLayer = new OLVectorLayer({
      style: (f, r) => this.styleCluster(f, r),
      minResolution: 305.748113141,
    });

    const olLayer = new OLLayerGroup({
      layers: [singleLayer, clusterLayer],
    });

    super({
      ...options,
      olLayer,
    });

    this.styleCache = {};
    this.visibilityKeys = [];

    this.geometryFunction = this.geometryFunction.bind(this);

    this.grandChildren = this.children.map(c => c.getChildren()).flat();
    this.setVisible(this.visible);

    // Same source for both layers
    this.source = new OLVectorSource({
      format: new GeoJSON(),
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
            this.source.clear();
            this.source.addFeatures(features);
          });
      },
    });

    singleLayer.setSource(this.source);
    clusterLayer.setSource(
      new ClusterSource({
        distance: 90,
        source: this.source,
        geometryFunction: this.geometryFunction,
      }),
    );
  }

  init(map) {
    super.init(map);

    this.visibilityKeys.push(
      this.grandChildren.map(childLayer => {
        return childLayer.on('change:visible', () => this.source.changed());
      }),
    );
  }

  terminate() {
    super.terminate();

    if (this.visibilityKeys.length) {
      unByKey(this.visibilityKeys);
    }
  }

  /**
   * Request feature information for a given coordinate.
   * Overrides the parent function
   * to handle the group layers and cluster features
   * @override
   * @param {ol.Coordinate} coordinate {@link https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html ol/Coordinate} to request the information at.
   * @returns {Promise<Object>} Promise with features, layer and coordinate
   *  or null if no feature was hit.
   */
  getFeatureInfoAtCoordinate(coordinate) {
    let features = [];

    if (this.map) {
      const pixel = this.map.getPixelFromCoordinate(coordinate);
      features = this.map.getFeaturesAtPixel(pixel, {
        layerFilter: l =>
          // Get group layers
          this.olLayer
            .getLayers()
            .getArray()
            .some(layer => l === layer),
        hitTolerance: this.hitTolerance,
      });
    }

    // Extract cluster features
    const feats = features
      .map(f => (f.get('features') ? f.get('features') : f))
      .flat();

    return Promise.resolve({
      features: feats,
      layer: this,
      coordinate:
        features.length && features[0].get('features')
          ? features[0].getGeometry().getCoordinates() // Cluster coordinate
          : coordinate,
    });
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
    const childLayer = this.grandChildren.find(
      child =>
        child.properties &&
        child.properties.construction &&
        child.properties.construction.art === feature.get('art') &&
        child.properties.construction.ort === feature.get('ort'),
    );

    return childLayer && childLayer.getVisible() ? feature.getGeometry() : null;
  }

  styleCluster(feature) {
    const count = feature.get('features').length;
    const cacheKey = `cluster_${count}`;

    if (!this.styleCache[cacheKey]) {
      const radius = 9 * Math.sqrt((count + 15) / Math.PI);

      this.styleCache[cacheKey] = [
        new Style({
          zIndex: 3,
          text: new Text({
            textBaseline: 'middle',
            textAlign: 'center',
            offsetY: 0,
            text: count.toString(),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 1)',
            }),
            font: 'bold 14px Arial, Verdana, Helvetica, sans-serif',
          }),
          image: new Circle({
            radius,
            fill: new Fill({
              color: 'rgba(0, 61, 133, 0.8)',
            }),
          }),
        }),
      ];
    }

    return this.styleCache[cacheKey];
  }

  styleSingle(feature) {
    if (!this.geometryFunction(feature)) {
      return null;
    }

    const cacheKey = `${feature.get('art')}_${feature.get('ort')}`;
    const filename = `${feature.get('art')}_${feature.get('ort')}`.replace(
      /[^A-Z,^0-9,-_]/gi,
      '',
    );

    if (!this.styleCache[cacheKey]) {
      this.styleCache[cacheKey] = [
        new Style({
          image: new Icon({
            src: `/img/layers/construction/${filename}.png`,
          }),
        }),
      ];
    }

    return this.styleCache[cacheKey];
  }
}

export default ConstructionLayer;
