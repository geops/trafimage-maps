import VectorLayer from 'react-spatial/layers/VectorLayer';
import OLVectorLayer from 'ol/layer/Vector';
import OLVectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import { getVectorContext } from 'ol/render';
import { unByKey } from 'ol/Observable';
import { easeOut } from 'ol/easing';

/**
 * Layer for zweitausbildung pois
 * Extends {@link https://react-spatial.geops.de/docjs.html#layer geops-spatial/Layer}
 * @private
 * @class
 * @param {Object} [options] Layer options.
 */
class ZweitausbildungPoisLayer extends VectorLayer {
  constructor(options = {}) {
    const olLayer = new OLVectorLayer({
      style: (f) => this.style(f),
      zIndex: options.zIndex || 0,
    });

    super({
      ...options,
      olLayer,
    });

    this.styleCache = {};
    this.setVisible(this.visible);

    this.zweitProps = this.get('zweitausbildung') || {};
    this.color = this.zweitProps.color || 'rgba(0, 61, 133, 0.8)';
    const viewparams = this.zweitProps.viewparams
      ? `viewparams=${this.zweitProps.viewparams}&`
      : '';

    this.source = new OLVectorSource({
      format: new GeoJSON(),
      loader: () => {
        fetch(
          `${this.geoServerUrl}?` +
            'service=WFS&version=1.0.0&request=GetFeature&' +
            'typeName=trafimage:zweitausbildung_pois_qry&' +
            `srsName=EPSG:3857&${viewparams}` +
            'outputFormat=application/json',
        )
          .then((data) => data.json())
          .then((data) => {
            const format = new GeoJSON();
            const features = format.readFeatures(data);
            this.source.clear();
            this.source.addFeatures(features);
          });
      },
    });

    olLayer.setSource(
      new ClusterSource({
        distance: 70,
        source: this.source,
      }),
    );

    this.animate = this.animate.bind(this);
  }

  setGeoServerUrl(geoServerUrl) {
    this.geoServerUrl = geoServerUrl;
  }

  setStaticFilesUrl(staticFilesUrl) {
    this.staticFilesUrl = staticFilesUrl;
  }

  init(map) {
    super.init(map);

    this.olLayerHighlight = new OLVectorLayer({
      map,
      // Use a dummy geometry to avoid rendering the default style
      // under the animation circle.
      // With a null style or an empty new Style(),
      // the postrender callback function would not be called.
      style: new Style({
        image: new Circle(),
      }),
      source: new OLVectorSource(),
    });

    this.olLayerHighlight.getSource().on('addfeature', () => {
      this.animationStartTime = new Date().getTime();
      unByKey(this.postrenderKey);
      this.postrenderKey = this.olLayerHighlight.on('postrender', this.animate);
    });
  }

  /**
   * Animate the highlight feature
   * based on https://openlayers.org/en/latest/examples/feature-animation.html
   */
  animate(event) {
    const duration = 200;
    const maxRadius = 14;
    const color = this.highlightFeature.get('color') || 'rgba(50, 50, 50, 0.8)';

    const elapsed = event.frameState.time - this.animationStartTime;

    if (elapsed < 0) {
      return;
    }

    const elapsedRatio = Math.min(elapsed, duration) / duration;
    // radius will be >= 1 at start and maxRadius+1 at end
    const radius = easeOut(elapsedRatio) * maxRadius + 1;

    const style = new Style({
      image: new Circle({
        fill: new Fill({
          color,
        }),
        radius,
      }),
      stroke: new Stroke({
        color,
        width: 8,
      }),
      fill: new Fill({
        color,
      }),
    });

    const vectorContext = getVectorContext(event);
    vectorContext.setStyle(style);
    vectorContext.drawGeometry(this.highlightFeature.getGeometry().clone());

    if (elapsed > duration) {
      unByKey(this.postrenderKey);
      return;
    }

    // Tell OpenLayers to continue postrender animation
    this.map.render();
  }

  style(feature) {
    const features = feature.get('features');
    const count = feature.get('features').length;
    const cacheKey = count;

    for (let i = 0; i < count; i += 1) {
      if (features[i].get('highlight')) {
        this.highlightFeature = features[i];
        this.olLayerHighlight.getSource().clear();
        this.olLayerHighlight.getSource().addFeature(this.highlightFeature);
      }
    }

    if (!this.styleCache[cacheKey]) {
      if (count === 1) {
        this.styleCache[cacheKey] = [
          new Style({
            zIndex: 2,
            radius: 14,
            image: new Circle({
              radius: 14,
              fill: new Fill({
                color: this.color,
              }),
            }),
          }),
          new Style({
            zIndex: 3,
            image: new Icon({
              src: `${this.staticFilesUrl}/img/layers/zweitausbildung/poi.png`,
            }),
          }),
        ];
      } else {
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
                color: this.color,
              }),
            }),
          }),
        ];
      }
    }

    return this.styleCache[cacheKey];
  }
}

export default ZweitausbildungPoisLayer;
