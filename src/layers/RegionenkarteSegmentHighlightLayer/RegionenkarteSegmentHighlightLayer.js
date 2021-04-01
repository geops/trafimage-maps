import { VectorLayer } from 'mobility-toolbox-js/ol';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { transform } from 'ol/proj';

/**
 * Layer for zweitausbildung highlight routes
 * Extends {@link https://mobility-toolbox-js.netlify.app/api/class/src/ol/layers/VectorLayer%20js~VectorLayer%20html}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class RegionenkarteSegmentHighlightLayer extends VectorLayer {
  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f, r) => this.style(f, r),
      source: new OLVectorSource({
        format: new GeoJSON(),
      }),
      zIndex: options.zIndex || 0,
    });

    super({
      ...options,
      olLayer,
    });

    this.styleCache = {};
    this.custom = this.get('custom') || {};
  }

  getFeatureInfoAtCoordinate(coordinate) {
    const layer = this;
    const meterRad = this.map && this.map.getView().getZoom() > 11 ? 100 : 1000;

    const [newX, newY] = transform(
      [parseInt(coordinate[0], 10), parseInt(coordinate[1], 10)],
      'EPSG:3857',
      'EPSG:21781',
    );

    return fetch(
      `${this.geoServerUrl}?` +
        'service=WFS&version=1.0.0&request=GetFeature&' +
        `typeName=trafimage:${this.custom.featureInfoLayer}&` +
        'maxFeatures=50&' +
        'outputFormat=application/json&' +
        `viewparams=x:${parseInt(newX, 10)};y:${parseInt(
          newY,
          10,
        )};r:${meterRad};network:trackit30`,
    )
      .then((data) => data.json())
      .then((data) => {
        const format = new GeoJSON();
        const features = format.readFeatures(data, {
          dataProjection: 'EPSG:21781',
          featureProjection: 'EPSG:3857',
        });
        this.olLayer.getSource().clear();
        this.olLayer.getSource().addFeatures(features);
        return {
          features,
          layer,
          coordinate,
        };
      })
      .catch(() => {
        this.olLayer.getSource().clear();
        return {
          features: [],
          layer,
          coordinate,
        };
      });
  }

  setGeoServerUrl(geoServerUrl) {
    this.geoServerUrl = geoServerUrl;
  }

  // eslint-disable-next-line class-methods-use-this
  style() {
    return new Style({
      stroke: new Stroke({
        color: '#f0f0f0',
        width: 8,
        opacity: 0.7,
      }),
    });
  }
}

export default RegionenkarteSegmentHighlightLayer;
